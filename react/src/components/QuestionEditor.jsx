import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useStateContext } from '../contexts/ContextProvider';

const QuestionEditor = ({ index = 0, question, questionChange, addQuestion, deleteQuestion }) => {
    const [model, setModel] = useState({ ...question });
    const { questionTypes } = useStateContext();

    useEffect(() => {
        questionChange(model);
    }, [model]);

    function upperCaseFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const shouldHaveOptions = (type) => {
        return ['select', 'radio', 'checkbox'].includes(type);
    };

    const setQuestionType = (ev) => {
        const type = ev.target.value;
        if (shouldHaveOptions(type)) {
            if (!model.data.options) {
                model.data = {
                    options: [
                        {
                            id: uuidv4(),
                            text: '',
                        },
                    ],
                };
            }
        }
        setModel({ ...model, type: type });
    };

    const addOption = (index) => {
        index = index !== undefined ? index + 1 : model.data.options.length;
        model.data.options.splice(index, 0, {
            id: uuidv4(),
            option: '',
        });
        setModel({ ...model });
    };
    const onOptionChange = (e, ind) => {
        model.data.options[ind].text = e.target.value;
        setModel({ ...model });
    };

    const deleteOption = (id) => {
        model.data.options = model.data.options.filter((op) => op.id !== id);
        setModel({ ...model });
    };

    return (
        <div>
            <div className="mb-3 flex justify-between">
                <h4>
                    {index + 1}. {model.question}
                </h4>
                <div className="flex items-center">
                    <button
                        type="button"
                        className="mr-2 flex items-center rounded-sm bg-gray-600 px-3 py-1 text-xs text-white hover:bg-gray-700"
                        onClick={() => addQuestion(index)}
                    >
                        <PlusIcon className="w-4" />
                        add
                    </button>
                    <button
                        type="button"
                        className="flex items-center rounded-sm border border-transparent px-3 py-1 text-xs font-semibold text-red-500 hover:border-red-600"
                        onClick={() => deleteQuestion(question)}
                    >
                        <TrashIcon className="w-4" />
                        Delete
                    </button>
                </div>
            </div>
            <div className="mb-3 flex justify-between gap-3">
                {/* Question Text */}
                <div className="flex-1">
                    <label htmlFor={question.id} className="block text-sm font-medium text-gray-700">
                        Question
                    </label>
                    <input
                        type="text"
                        name="question"
                        id={question.id}
                        value={model.question}
                        onChange={(ev) => setModel({ ...model, question: ev.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    ></input>
                </div>
                {/* Question Text */}

                {/* Question Type */}
                <div>
                    <label htmlFor="questionType" className="block w-40 text-sm font-medium text-gray-700">
                        Question Type
                    </label>
                    <select
                        name="questionType"
                        id="questionType"
                        defaultValue={model.type}
                        onChange={(ev) => {
                            setQuestionType(ev);
                        }}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none sm:text-sm"
                    >
                        {questionTypes.map((type) => (
                            <option value={type} key={type}>
                                {upperCaseFirst(type)}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Question Type */}
            </div>

            {/* Description */}
            <div>
                <label htmlFor={`${question.id}Description`} className="block text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    id={`${question.id}Description`}
                    name="questionDescription"
                    value={model.description || ''}
                    onChange={(ev) => setModel({ ...model, description: ev.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                ></textarea>
            </div>
            {/* Description */}
            {/* Question Options */}
            {shouldHaveOptions(model.type) && (
                <>
                    <div className="mt-4 flex items-center justify-between gap-3">
                        <h4 className="text-xl font-bold">Options</h4>
                        <button
                            type="button"
                            className="mb-3 flex items-center rounded-sm bg-gray-600 px-2 py-1 text-sm text-white hover:bg-gray-700"
                            onClick={() => addOption()}
                        >
                            <PlusIcon className="mr-2 w-4" />
                            Add Option
                        </button>
                    </div>
                    {model.data.options.length === 0 && (
                        <div className="py-3 text-center text-xs text-gray-600">You don't have any options defined</div>
                    )}

                    {model.data.options.map((option, ind) => (
                        <div className="mt-2 flex justify-between gap-3" key={option.id}>
                            <div className="flex flex-1 items-center gap-2">
                                <span className="text-sm font-medium text-gray-700">{ind + 1}.</span>
                                <input
                                    type="text"
                                    id="option"
                                    value={option.text || ''}
                                    onChange={(ev) => onOptionChange(ev, ind)}
                                    className="block w-full rounded-md border border-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                ></input>
                            </div>
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    className="mr-2 flex items-center rounded-sm bg-gray-600 px-3 py-1 text-xs text-white hover:bg-gray-700"
                                    onClick={() => addOption(ind)}
                                >
                                    <PlusIcon className="w-4" />
                                </button>
                                <button
                                    type="button"
                                    className="flex items-center rounded-sm border border-transparent px-3 py-1 text-xs font-semibold text-red-500 hover:border-red-600"
                                    onClick={() => deleteOption(option.id)}
                                >
                                    <TrashIcon className="w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </>
            )}

            {/* Question Options */}
        </div>
    );
};

export default QuestionEditor;
