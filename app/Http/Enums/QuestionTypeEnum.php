<?php

namespace App\Http\Enums;

enum QuestionTypeEnum :string
{
    case TYPE_TEXT="text";
    case TYPE_TEXTAREA="textarea";
    case TYPE_CHECKBOX="checkbox";
    case TYPE_SELECT="select";
    case TYPE_Radio="radio";
}
