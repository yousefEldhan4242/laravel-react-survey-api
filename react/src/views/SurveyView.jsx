import { LinkIcon, PhotoIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../axios.js';
import TButton from '../components/core/TButton.jsx';
import PageComponent from '../components/PageComponent.jsx';
import SurveyQuestions from '../components/SurveyQuestions.jsx';
import { useStateContext } from '../contexts/ContextProvider.jsx';

export default function SurveyView() {
    const { showToast, showErrorToast } = useStateContext();
    const navigate = useNavigate();
    const { id } = useParams();

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const [survey, setSurvey] = useState({
        title: '',
        status: false,
        description: '',
        image: null,
        expire_date: '',
        questions: [],
    });

    const onImageChoose = (ev) => {
        const file = ev.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            setSurvey({
                ...survey,
                image: reader.result,
            });
            ev.target.value = '';
        };
        reader.readAsDataURL(file);
    };

    const onSubmit = (ev) => {
        ev.preventDefault();
        let request = null;
        const Finalquestions = survey.questions.map((question) => {
            if (question.type == 'text' || question.type == 'textarea') {
                question.data.options = [];
                return { ...question };
            } else {
                return question;
            }
        });
        const payload = { ...survey, questions: Finalquestions };
        if (id) {
            request = axiosClient.put(`/survey/${id}`, payload);
        } else {
            request = axiosClient.post('/survey', payload);
        }

        request
            .then(() => {
                navigate('/surveys');
                if (id) {
                    showToast('survey has been updated');
                } else {
                    showToast('survey has been created');
                }
            })
            .catch((err) => {
                if (err.response.data.errors) {
                    setErrors(err.response.data.errors);
                }
                if (err.response.data.error) {
                    setErrors(err.response.data);
                }
            });
    };
    const onDeleteClick = (id) => {
        if (confirm('Are you sure you want to delete this survey')) {
            axiosClient
                .delete(`/survey/${id}`)
                .then(() => {
                    navigate('/surveys');
                    showToast('survey has been deleted');
                })
                .catch((err) => {
                    if (err.response.status === 403) {
                        showErrorToast('You are not authorized to delete this survey.');
                    } else {
                        showErrorToast('Something went wrong. Please refresh and try again.');
                    }
                });
        }
    };

    function onQuestionsUpdate(questions) {
        setSurvey({ ...survey, questions: questions });
    }

    useEffect(() => {
        if (id) {
            setLoading(true);
            axiosClient
                .get(`/survey/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setSurvey(data.data);
                })
                .catch((err) => {
                    if (err.response.status === 404) {
                        showErrorToast('Survey Not Found may be deleted.');
                        navigate('/surveys');
                        
                    } else {
                        showErrorToast('Something went wrong. Please refresh and try again.');
                    }
                });
        }
    }, []);

    return (
        <PageComponent
            title={id ? 'Update Survey' : 'Create new Survey'}
            buttons={
                id && (
                    <div className="flex items-center gap-2">
                        <TButton href={`/survey/public/${survey.slug}`} color="green">
                            <LinkIcon className="mr-2 h-4 w-4" />
                            public Link
                        </TButton>
                        <TButton onClick={() => onDeleteClick(id)} color="red">
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Delete
                        </TButton>
                    </div>
                )
            }
        >
            {loading && <div className="text-center text-2xl"> Loading...</div>}
            {!loading && (
                <form action="#" method="POST" onSubmit={onSubmit}>
                    <div className="shadow sm:overflow-hidden sm:rounded-md">
                        <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                            {errors.error && errors.message && (
                                <>
                                    <div className="rounded bg-red-500 px-3 py-2 text-white">{errors.error}</div>
                                </>
                            )}

                            {/*Image*/}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Photo</label>
                                <div className="mt-1 flex items-center">
                                    {survey.image && <img src={survey.image} alt="" className="h-32 w-32 object-cover" />}
                                    {!survey.image && (
                                        <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-gray-400">
                                            <PhotoIcon className="h-8 w-8" />
                                        </span>
                                    )}
                                    <button
                                        type="button"
                                        className="relative ml-5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm leading-4 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                                    >
                                        <input type="file" className="absolute top-0 right-0 bottom-0 left-0 opacity-0" onChange={onImageChoose} />
                                        Change
                                    </button>
                                </div>
                            </div>
                            {/*Image*/}

                            {/*Title*/}
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    Survey Title
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={survey.title}
                                    onChange={(ev) => setSurvey({ ...survey, title: ev.target.value })}
                                    placeholder="Survey Title"
                                    className={
                                        'mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ' +
                                        (errors.title ? 'border-2 border-red-500' : 'border-gray-300')
                                    }
                                />
                                {errors.title && <div className="text-sm text-red-500">{errors.title}</div>}
                            </div>
                            {/*Title*/}

                            {/*Description*/}
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                {/* <pre>{ JSON.stringify(survey, undefined, 2) }</pre> */}
                                <textarea
                                    name="description"
                                    id="description"
                                    value={survey.description || ''}
                                    onChange={(ev) => setSurvey({ ...survey, description: ev.target.value })}
                                    placeholder="Describe your survey"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                ></textarea>
                            </div>
                            {/*Description*/}

                            {/*Expire Date*/}
                            <div className="col-span-6 sm:col-span-3">
                                <label htmlFor="expire_date" className="block text-sm font-medium text-gray-700">
                                    Expire Date
                                </label>
                                <input
                                    type="date"
                                    name="expire_date"
                                    id="expire_date"
                                    value={survey.expire_date}
                                    onChange={(ev) => setSurvey({ ...survey, expire_date: ev.target.value })}
                                    className={
                                        'mt-1 block w-full rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ' +
                                        (errors.expire_date ? 'border-2 border-red-500' : 'border-gray-300')
                                    }
                                />
                                {errors.expire_date && <small className="text-red-500">{errors.expire_date}</small>}
                            </div>
                            {/*Expire Date*/}

                            {/*Active*/}
                            <div className="flex items-start">
                                <div className="flex h-5 items-center">
                                    <input
                                        id="status"
                                        name="status"
                                        type="checkbox"
                                        checked={survey.status}
                                        onChange={(ev) => setSurvey({ ...survey, status: ev.target.checked })}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="comments" className="font-medium text-gray-700">
                                        Active
                                    </label>
                                    <p className="text-gray-500">Whether to make survey publicly available</p>
                                </div>
                            </div>
                            {/*Active*/}
                            <SurveyQuestions key={survey.questions.length} questions={survey.questions} onQuestionsUpdate={onQuestionsUpdate} />
                        </div>
                        <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                            <TButton>Save</TButton>
                        </div>
                    </div>
                </form>
            )}
        </PageComponent>
    );
}
