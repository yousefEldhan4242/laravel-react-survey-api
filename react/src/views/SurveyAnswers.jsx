import humanizeDuration from 'humanize-duration';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../axios';
import { useStateContext } from '../contexts/ContextProvider';

const SurveyAnswers = () => {
    const { id } = useParams();
    const [survey, setSurvey] = useState({});
    const [loading, setLoading] = useState(true);
    const [searchAnswer, setSearchAnswer] = useState('');
    const [searchDate, setSearchDate] = useState('DESC');
    const { showErrorToast } = useStateContext();
    const navigate = useNavigate();

    const getSurvey = () => {
        axiosClient
            .get(`/answers/survey/${id}`, {
                params: {
                    search: { searchAnswer, searchDate },
                },
            })
            .then(({ data }) => {
                setLoading(false);
                setSurvey(data.data)
            })
            .catch((err) => {
                if (err.response.status == 404) {
                    showErrorToast('Survey Not Found may be deleted.');
                    navigate('/');
                } else {
                    showErrorToast('Something went wrong. Please refresh and try again.');
                }
            });
    };
    const onBlur = (e) => {
        setSearchAnswer(e.target.value);
    };
    const onKeyDown = (e) => {
        if (e.key != 'Enter') return;
        setSearchAnswer(e.target.value);
    };
    const onClickDate = () => {
      if (searchDate == "DESC"){
        setSearchDate("ASC")
      }else{
        setSearchDate("DESC")
      }
    }
    useEffect(() => {
        getSurvey();
    }, [searchAnswer,searchDate]);
    return (
        <div className="dark font-[Spline Sans] min-h-screen text-white">
            <header className="/80 sticky top-0 z-10 backdrop-blur-sm">
                <div className="flex items-center p-4">
                    <button className="text-white">
                        <svg fill="currentColor" height="24" width="24" viewBox="0 0 256 256">
                            <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
                        </svg>
                    </button>
                    <h1 className="flex-1 text-center text-xl font-bold text-black">Survey Answers</h1>
                    <div className="w-6" />
                </div>
            </header>
            {loading && <div className="text-center text-2xl text-black"> Loading...</div>}

            {!loading && (
                <main className="px-4 py-6">
                    {/* Survey Summary */}
                    <section className="mb-8">
                        <h2 className="mb-4 text-2xl font-bold text-black">Survey Summary</h2>
                        <div className="rounded-xl bg-[#2c2c2c] p-4">
                            <SummaryItem label="Survey Title" value={survey.title} />
                            <SummaryItem label="Total Answers" value={survey.answers.length} border={false} />
                        </div>
                    </section>

                    {/* Filters & Search */}
                    <section>
                        <h2 className="mb-4 text-2xl font-bold text-black">Answers</h2>

                        <div className="mb-4">
                            <input
                                onKeyDown={(e) => onKeyDown(e)}
                                onBlur={(e) => onBlur(e)}
                                className="form-input h-12 w-full rounded-xl border border-gray-700 bg-[#2c2c2c] p-3 text-base placeholder:text-white focus:outline-none"
                                placeholder="Search Answers"
                            />
                        </div>

                        <div className="mb-6 flex flex-wrap gap-3">
                            <FilterButton onClick={onClickDate} label="Date" searchDate={searchDate} />
                        </div>

                        {/* Answer Cards */}
                        <div className="space-y-4">
                            {survey.answers.map((answer) => (
                                <AnswerCard
                                    key={answer.id}
                                    id={answer.id}
                                    date={answer.start_date}
                                    duration={humanizeDuration(new Date(answer.end_date) - new Date(answer.start_date))}
                                    answers={answer.question_answers}
                                />
                            ))}
                        </div>
                    </section>
                </main>
            )}
        </div>
    );
};

export default SurveyAnswers;

const SummaryItem = ({ label, value, border = true }) => (
    <div className={`flex justify-between py-3 ${border ? 'border-b border-gray-700' : ''}`}>
        <p className="text-sm text-white">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
    </div>
);

const FilterButton = ({ label, searchDate,onClick }) => (
    <button onClick={onClick} className="flex h-9 items-center gap-x-2 rounded-full border border-gray-700 bg-[#2c2c2c] pr-2 pl-4">
        <p className="text-sm font-medium text-white">{label}</p>
        <div className="text-white">
            {searchDate == 'DESC' ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                </svg>
            )}
        </div>
    </button>
);

const AnswerCard = ({ id, date, duration, answers }) => (
    <div className="rounded-xl bg-[#2c2c2c] p-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
                <p className="text-xs text-white">Answer ID</p>
                <p className="text-sm font-medium text-white">{id}</p>
            </div>
            <div className="flex flex-col gap-1">
                <p className="text-xs text-white">Start Date</p>
                <p className="text-sm font-medium text-white">{date}</p>
            </div>
            <div className="col-span-2 flex flex-col gap-1">
                <p className="text-xs text-white">Duration</p>
                <p className="text-sm font-medium text-white">{duration}</p>
            </div>
        </div>
        <div className="mt-4 space-y-3 border-t border-gray-700 pt-4">
            {answers.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                    <p className="text-md text-white">{item.question.question}</p>
                    <p className="text-sm text-white">
                        {item.question.type == 'checkbox' ? String(item.answer).replaceAll('"', '').replaceAll(',', ', ') : item.answer}
                    </p>
                </div>
            ))}
        </div>
    </div>
);
