import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import axiosClient from '../axios';
import TButton from '../components/core/TButton';
import PageComponent from '../components/PageComponent';
import PaginationLinks from '../components/PaginationLinks';
import SurveyListItem from '../components/SurveyListItem';
import { useStateContext } from '../contexts/ContextProvider';

export default function Surveys() {
    const {showErrorToast,showToast} = useStateContext()  
    const [surveys, setSurveys] = useState([]);
    const [meta, setMeta] = useState({});
    const [loading, setLoading] = useState(false);
    
    const onDeleteClick = (id) => {
        if (confirm('Are you sure you want to delete this survey')) {
            axiosClient
                .delete(`/survey/${id}`)
                .then(() => {
                    getSurveys();
                    showToast("survey has been deleted")
                })
                .catch((err) => {
                    if (err.response.status === 403){
                        showErrorToast("You are not authorized to delete this survey.")
                    }else{
                        showErrorToast("Something went wrong. Please refresh and try again.")
                    }
                });
        }
    };

    const onPageClick = (url) => {
        getSurveys(url);
    };

    const getSurveys = (url) => {
        url = url || '/survey';
        setLoading(true);
        axiosClient.get(url).then(({ data }) => {
            setSurveys(data.data);
            setMeta(data.meta);
            setLoading(false);
        });
    };

    useEffect(() => {
        getSurveys();
    }, []);
    return (
        <PageComponent
            title={'Surveys'}
            buttons={
                <TButton to="/surveys/create" color="green">
                    <PlusCircleIcon className="mr-2 h-6 w-6" />
                    Create new
                </TButton>
            }
        >
            {loading && <div className="text-center text-2xl"> Loading...</div>}
            {!loading && (
                <div>
                    {surveys.length === 0 && <div className="py-8 text-center text-gray-700">You Don't have any surveys created</div>}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                        {surveys.map((survey) => (
                            <SurveyListItem survey={survey} key={survey.id} onDeleteClick={onDeleteClick} />
                        ))}
                    </div>
                    {surveys.length > 0 && <PaginationLinks meta={meta} onPageClick={onPageClick} />}
                </div>
            )}
        </PageComponent>
    );
}
