<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Survey extends Model
{
    use HasSlug;
    protected $fillable = ["title", "description", "expire_date", "user_id", "image", "slug", "status", "created_at", "updated_at"];

    /**
     * Get the options for generating the slug.
     */
    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(SurveyQuestion::class);
    }
    public function answers(): HasMany
    {
        return $this->hasMany(SurveyAnswer::class);
    }
}
