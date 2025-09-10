import { EyeIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import axiosClient from '../axios';
import DashboardCard from '../components/DashboardCard';
import PageComponent from '../components/PageComponent';
import TButton from '../components/core/TButton';

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({});

    console.log(data.latestAnswers)
    useEffect(() => {
        axiosClient
            .get('/dashboard')
            .then(({ data }) => {
                setLoading(false);
                setData(data);
                (data);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);
    return (
        <PageComponent title={'Dashboard'}>
            {loading && <div className="flex justify-center">Loading...</div>}
            {!loading && (
                <div className="grid grid-cols-1 gap-5 text-gray-700 md:grid-cols-2 lg:grid-cols-3">
                    <DashboardCard title="Total Surveys" className="order-1 lg:order-2" style={{ animationDelay: '0.1s' }}>
                        <div className="flex flex-1 items-center justify-center pb-4 text-8xl font-semibold">{data.totalSurveys}</div>
                    </DashboardCard>
                    <DashboardCard title="Total Answers" className="order-2 lg:order-4" style={{ animationDelay: '0.2s' }}>
                        <div className="flex flex-1 items-center justify-center pb-4 text-8xl font-semibold">{data.totalAnswers}</div>
                    </DashboardCard>
                    <DashboardCard title="Latest Surveys" className="order-3 row-span-2 lg:order-1" style={{ animationDelay: '0.2s' }}>
                        {data.latestSurvey && (
                            <div>
                                <img src={data.latestSurvey.image} className="mx-auto w-[240px]" />
                                <h3 className="mb-3 text-xl font-bold">{data.latestSurvey.title}</h3>
                                <div className="mb-1 flex justify-between text-sm">
                                    <div>Create Date:</div>
                                    <div>{data.latestSurvey.created_at}</div>
                                </div>
                                <div className="mb-1 flex justify-between text-sm">
                                    <div>Expire Date:</div>
                                    <div>{data.latestSurvey.expire_date}</div>
                                </div>
                                <div className="mb-1 flex justify-between text-sm">
                                    <div>Status:</div>
                                    <div>{data.latestSurvey.status ? 'Active' : 'Draft'}</div>
                                </div>
                                <div className="mb-1 flex justify-between text-sm">
                                    <div>Questions:</div>
                                    <div>{data.latestSurvey.questions}</div>
                                </div>
                                <div className="mb-3 flex justify-between text-sm">
                                    <div>Answers:</div>
                                    <div>{data.latestSurvey.answers}</div>
                                </div>
                                <div className="flex justify-between">
                                    <TButton to={`/surveys/${data.latestSurvey.id}`} link>
                                        <PencilIcon className="mr-2 h-5 w-5" />
                                        Edit Survey
                                    </TButton>

                                    <TButton to={`answers/survey/${data.latestSurvey.id}`} link>
                                        <EyeIcon className="mr-2 h-5 w-5" />
                                        View Answers
                                    </TButton>
                                </div>
                            </div>
                        )}
                        {!data.latestSurvey && <div className="py-16 text-center text-gray-600">Your don't have surveys yet</div>}
                    </DashboardCard>
                    <DashboardCard title="Latest Answers" className="order-4 row-span-2 lg:order-3" style={{ animationDelay: '0.3s' }}>
                        {data.latestAnswers && data.latestAnswers.length > 0 && (
                            <div className="text-left">
                                {data.latestAnswers.map((answer) => (
                                    <a href="#" key={answer.id} className="block p-2 hover:bg-gray-100/90">
                                        <div className="font-semibold">{answer.survey.title}</div>
                                        <small>
                                            Answer Made at:
                                            <i className="font-semibold"> {answer.end_date}</i>
                                        </small>
                                    </a>
                                ))}
                            </div>
                        )}

                        {data.latestAnswers && !data.latestAnswers.length && (
                            <div className="py-16 text-center text-gray-600">Your don't have answers yet</div>
                        )}
                    </DashboardCard>
                </div>
            )}
        </PageComponent>
    );
}
