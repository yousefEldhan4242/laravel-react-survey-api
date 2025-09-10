import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../axios';
import PublicQuestionView from '../components/PublicQuestionView';

const SurveyPublicView = () => {
    const answers = {};

    const start_date = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const { slug } = useParams();
    const [surveyFinished, setSurveyFinished] = useState(false);
    const [error, setError] = useState('');
    const [survey, setSurvey] = useState({
        questions: [],
    });
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);

        axiosClient
            .get(`/survey/get-by-slug/${slug}`)
            .then(({ data }) => {
                setSurvey(data.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                if (err.response.status === 404) {
                    setError('Survey Unavailable');
                }
            });
    }, []);

    function answerChanged(question, value) {
        answers[question.id] = value;
    }

    const onSubmit = (e) => {
        e.preventDefault();
        const end_date = dayjs().format('YYYY-MM-DD HH:mm:ss');
        const payload = {answers: {...answers} , start_date,end_date}
        axiosClient
            .post(`/survey/${survey.id}/answer`, payload)
            .then(() => {
                setSurveyFinished(true);
            });
    };

    return (
        <div>
            {loading && <div className="text-center text-2xl"> Loading...</div>}
            {!loading && !error && survey.questions && survey.questions.length > 0 && (
                <form onSubmit={onSubmit} className="container mx-auto">
                    <div className="grid grid-cols-6">
                        <div className="mr-2">
                            <img src={survey.image} alt={survey.title} />
                        </div>
                        <div className="col-span-5">
                            <h1 className="mb-3 text-3xl">{survey.title}</h1>
                            <p className="mb-3 text-sm text-gray-500">Expire Date: {survey.expire_date}</p>
                            <p className="mb-3 text-sm text-gray-500">{survey.description}</p>
                        </div>
                    </div>
                    {surveyFinished && (
                        <div className="mx-auto w-[600px] bg-emerald-500 px-6 py-8 text-white">Thank you for participating in our survey</div>
                    )}
                    {!surveyFinished && (
                        <>
                            <div>
                                {survey.questions.map((question, index) => (
                                    <PublicQuestionView
                                        question={question}
                                        key={question.id}
                                        index={index}
                                        answerChanged={(val) => answerChanged(question, val)}
                                    />
                                ))}
                            </div>
                            <button
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                            >
                                Submit
                            </button>
                        </>
                    )}
                </form>
            )}
            {error && (
                <div class="flex min-h-[300px] items-center justify-center rounded-md bg-gray-100">
                    <div class="px-6 py-10 text-center">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="mx-auto mb-4 h-12 w-12 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 9v2m0 4h.01M12 5c-3.866 0-7 3.134-7 7s3.134 7 7 7 7-3.134 7-7-3.134-7-7-7z"
                            />
                        </svg>
                        <h2 class="text-lg font-semibold text-gray-800">{error}</h2>
                        <p class="mt-2 text-gray-600">This survey is either deleted, private, or currently inactive.</p>
                    </div>
                </div>
            )}
            {!loading && survey.questions && !(survey.questions.length > 0) && (
                <div className="mx-auto mt-20 w-[600px] bg-red-500 px-6 py-8 text-white">Sorry there is no questions.</div>
            )}
        </div>
    );
};

export default SurveyPublicView;
