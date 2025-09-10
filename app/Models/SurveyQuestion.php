<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SurveyQuestion extends Model
{
    protected $fillable = [
        "question",
        "type",
        "description",
        "data",
        "survey_id"
    ];

    public function answers()
    {
        return $this->hasMany(SurveyQuestionAnswer::class);
    }
}
