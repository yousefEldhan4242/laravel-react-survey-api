<?php

namespace App\Http\Controllers;

use App\Http\Enums\QuestionTypeEnum;
use App\Http\Requests\StoreSurveyAnswerRequest;
use App\Http\Resources\ViewSurveyAnswersResource;
use App\Models\Survey;
use App\Http\Requests\StoreSurveyRequest;
use App\Http\Requests\UpdateSurveyRequest;
use App\Http\Resources\SurveyResource;
use App\Models\SurveyAnswer;
use App\Models\SurveyQuestion;
use App\Models\SurveyQuestionAnswer;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Enum;
use function PHPUnit\Framework\isArray;
use function PHPUnit\Framework\isObject;

use Exception;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        return SurveyResource::collection(Survey::where("user_id", $user->id)->orderBy("created_at", "desc")->paginate(3));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSurveyRequest $request)
    {
        $data = $request->validated();


        try {
            return DB::transaction(function () use ($data) {
                if (isset($data["image"])) {
                    $relativePath = $this->saveImage($data["image"]);
                    $data["image"] = $relativePath;
                }

                $survey = Survey::create($data);

                foreach ($data["questions"] as $question) {
                    $question["survey_id"] = $survey->id;
                    $this->createQuestion($question);
                }

                return new SurveyResource($survey);
            });
        } catch (Exception $e) {
            // Log the error if needed
            // Log::error('Survey creation failed: ' . $e->getMessage());

            // Return appropriate error response
            return response()->json([
                'message' => 'Survey creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(Survey $survey, Request $request)
    {
        $user = $request->user();

        if ($survey->user_id !== $user->id) {
            abort(403, "Unauthorized Action");
        }
        return new SurveyResource($survey);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSurveyRequest $request, Survey $survey)
    {
        $data = $request->validated();
        try {
            return DB::transaction(function () use ($data, $survey) {
                if (isset($data["image"])) {
                    $relativePath = $this->saveImage($data["image"]);
                    $data["image"] = $relativePath;
                }
                if ($survey->image) {
                    if (!str_contains($survey->image, "images/")) {
                        $abolutePath = public_path($survey->image);
                        File::delete($abolutePath);
                    }
                }

                $survey->update($data);

                $existingIds = $survey->questions()->pluck("id")->toArray();
                $newIds = Arr::pluck($data["questions"], "id");

                $toDelete = array_diff($existingIds, $newIds);
                $toAdd = array_diff($newIds, $existingIds);

                SurveyQuestion::destroy($toDelete);

                foreach ($data["questions"] as $question) {
                    if (isset(array_flip($toAdd)[$question["id"]])) {

                        $question["survey_id"] = $survey->id;
                        $this->createQuestion($question);
                    }
                }


                $questionMap = collect($data["questions"])->keyBy("id");
                foreach ($survey->questions as $question) {
                    if (isset($questionMap[$question->id])) {
                        $this->updateQuestion($question, $questionMap[$question->id]);
                    }
                }
                return new SurveyResource($survey);
            });
        } catch (Exception $e) {
            // Log the error if needed
            // Log::error('Survey creation failed: ' . $e->getMessage());

            // Return appropriate error response
            return response()->json([
                'message' => 'Survey creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Survey $survey, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $survey->user_id) {
            abort(403, "Unauthorized Action");
        }
        $survey->delete();

        if ($survey->image) {
            $absolutePath = public_path($survey->image);
            File::delete($absolutePath);
        }
        return response("", 204);
    }

    private function saveImage($image)
    {
        // check if image is valid base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
            // take out the base encoded type without mime type
            $image = substr($image, strpos($image, ",") + 1);

            // get file extension
            $type = strtolower($type[1]);

            // check if file is an image
            if (!in_array($type, ["jpg", "jpeg", "gif", "png"])) {
                throw new Exception("Invalid image type");
            }
            $image = str_replace(" ", "+", $image);
            $image = base64_decode($image);
            if ($image === false) {
                throw new Exception("base64_decode failed");
            }
        } else {
            // if the image isn't changed
            if (str_contains($image, "images/")) {
                // TODO replace on production
                return str_replace("http://localhost:8000/", "", $image);
            } else {

                throw new Exception("didn't match data URI with image data");
            }
        }

        $dir = "images/";
        $file = Str::random() . "." . $type;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;
        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }
        file_put_contents($relativePath, $image);
        return $relativePath;
    }

    private function createQuestion($data)
    {
        if (is_array($data["data"])) {
            $data["data"] = json_encode($data["data"]);
        }
        $validator = Validator::make($data, [
            "question" => ["required", "string"],
            "type" => ["required", new Enum(QuestionTypeEnum::class)],
            "description" => ["nullable", "string"],
            "data" => "present",
            "survey_id" => "exists:surveys,id"
        ]);
        return SurveyQuestion::create($validator->validated());
    }

    private function updateQuestion(SurveyQuestion $question, $data)
    {
        if (is_array($data["data"])) {
            $data["data"] = json_encode($data["data"]);
        }
        $validator = Validator::make($data, [
            "id" => "exists:survey_questions,id",
            "question" => ["required", "string"],
            "type" => ["required", new Enum(QuestionTypeEnum::class)],
            "desctiption" => ["nullable", "string"],
            "data" => "present",
        ]);
        return $question->update($validator->validated());
    }
    public function getBySlug(string $slug)
    {
        $survey = Survey::where("slug", "=", $slug)->first();
        if (!$survey->status) {
            return response("", 404);
        }
        $currentDate = new \DateTime();
        $expireDate = new \DateTime($survey->expire_date);
        if ($currentDate > $expireDate) {
            return response("", 404);
        }
        return new SurveyResource($survey);
    }
    public function storeAnswer(StoreSurveyAnswerRequest $request, Survey $survey)
    {
        $validated = $request->validated();

        $surveyAnswer = SurveyAnswer::create([
            "survey_id" => $survey->id,
            "start_date" => $validated["start_date"],
            "end_date" => $validated["end_date"],
        ]);

        foreach ($validated["answers"] as $questionId => $answer) {
            $question = SurveyQuestion::where(["id" => $questionId, "survey_id" => $survey->id])->get();
            if (!$question) {
                return response("Invalid qustion ID: \"$questionId\" ", 400);
            }
            $data = [
                "survey_question_id" => $questionId,
                "survey_answer_id" => $surveyAnswer->id,
                "answer" => is_array($answer) ? json_encode($answer) : $answer,
            ];
            SurveyQuestionAnswer::create($data);
        }
        return response("", 201);
    }

    public function viewAnswers(Request $request, Survey $survey)
    {
        $search = $request->query('search');

        $survey->load([
            'answers' => function ($query) use ($search) {
                if (!empty($search['searchAnswer'])) {
                    $query->whereHas('questionAnswers', function ($q) use ($search) {
                        $q->where('answer', 'like', '%' . $search["searchAnswer"] . '%');
                    });
                }
                $query->orderBy("start_date",$search["searchDate"]);
            },
        ]);

        return new ViewSurveyAnswersResource($survey);
    }
}
