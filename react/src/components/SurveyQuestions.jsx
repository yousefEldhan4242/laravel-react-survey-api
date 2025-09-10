import { PlusIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import QuestionEditor from './QuestionEditor';

const SurveyQuestions = ({ questions, onQuestionsUpdate }) => {
    const [myQuestions, setMyQuestions] = useState([...questions]);
    const addQuestion = (index) => {
        index = index !== undefined ? index + 1 : myQuestions.length;
        myQuestions.splice(index, 0, {
                id: uuidv4(),
                type: 'text',
                question: '',
                description: '',
                data: {
                },
            })
        setMyQuestions([...myQuestions])
    };

    const questionChange = (question) => {
        if (!question) return;

        const newQuestions = myQuestions.map((q) => {
            if (q.id === question.id) {
                return { ...question };
            }
            return q;
        });
        setMyQuestions([ ...newQuestions ]);
    };

    const deleteQuestion = (question) => {
        const nonDeletedQuesttions = myQuestions.filter((q) => q.id !== question.id);
        setMyQuestions([...nonDeletedQuesttions]);
    };

    useEffect(() => {
        onQuestionsUpdate(myQuestions);
    }, [myQuestions]);

    return (
        <>
            <div className="flex justify-between">
                <h3 className="text-2xl font-bold">Questions</h3>
                <button
                    type="button"
                    className="flex items-center rounded-sm bg-gray-600 px-4 py-1 text-sm text-white hover:bg-gray-700"
                    onClick={() => addQuestion()}
                >
                    <PlusIcon className="mr-2 w-4" />
                    Add Question
                </button>
            </div>
            {myQuestions.length ? (
                myQuestions.map((q, ind) => (
                    <QuestionEditor
                        key={q.id}
                        index={ind}
                        question={q}
                        questionChange={questionChange}
                        addQuestion={addQuestion}
                        deleteQuestion={deleteQuestion}
                    />
                ))
            ) : (
                <div className="py-4 text-center text-gray-400">You don't have any questions created</div>
            )}
        </>
    );
};

export default SurveyQuestions;
