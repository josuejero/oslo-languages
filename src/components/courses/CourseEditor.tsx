import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormField, Input, Select, Textarea } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import OptimizedImage from '@/components/OptimizedImage';

interface Course {
  id: string;
  title: string;
  description: string;
  language: string;
  level: string;
  schedule: string;
  duration: string;
  price: string;
  maxStudents: number;
  startDate: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}


interface CourseEditorProps {
  course?: Course;
  onSave: (course: Course) => void;
  onCancel: () => void;
}

interface CourseFormData {
  title: string;
  description: string;
  language: string;
  level: string;
  schedule: string;
  duration: string;
  price: string;
  maxStudents: number;
  startDate: string;
  imageUrl?: string;
}

const LANGUAGES = [
  { value: 'norwegian', label: 'Norwegian' },
  { value: 'english', label: 'English' },
  { value: 'spanish', label: 'Spanish' }
];

const LEVELS = [
  { value: 'A1', label: 'Beginner (A1)' },
  { value: 'A2', label: 'Elementary (A2)' },
  { value: 'B1', label: 'Intermediate (B1)' },
  { value: 'B2', label: 'Upper Intermediate (B2)' },
  { value: 'C1', label: 'Advanced (C1)' }
];

export default function CourseEditor({ course, onSave, onCancel }: CourseEditorProps) {
  const [imagePreview, setImagePreview] = useState<string>(course?.imageUrl || '');
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CourseFormData>({
    defaultValues: course ? {
      title: course.title,
      description: course.description,
      language: course.language,
      level: course.level,
      schedule: course.schedule,
      duration: course.duration,
      price: course.price,
      maxStudents: course.maxStudents,
      startDate: course.startDate,
      imageUrl: course.imageUrl
    } : {}
  });

  const onSubmit = async (data: CourseFormData) => {
    try {
      const courseData = {
        ...data,
        id: course?.id || crypto.randomUUID(),
        updatedAt: new Date().toISOString(),
        createdAt: course?.createdAt || new Date().toISOString()
      };

      await onSave(courseData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save course');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <FormField
            label="Title"
            error={errors.title?.message}
            required
          >
            <Input
              {...register('title', { required: 'Title is required' })}
              placeholder="Enter course title"
            />
          </FormField>

          <FormField
            label="Description"
            error={errors.description?.message}
            required
          >
            <Textarea
              {...register('description', { required: 'Description is required' })}
              rows={5}
              placeholder="Enter course description"
            />
          </FormField>

          <FormField
            label="Language"
            error={errors.language?.message}
            required
          >
            <Select
              options={LANGUAGES}
              {...register('language', { required: 'Language is required' })}
            />
          </FormField>

          <FormField
            label="Level"
            error={errors.level?.message}
            required
          >
            <Select
              options={LEVELS}
              {...register('level', { required: 'Level is required' })}
            />
          </FormField>
        </div>

        <div className="space-y-6">
          <FormField
            label="Schedule"
            error={errors.schedule?.message}
            required
          >
            <Input
              {...register('schedule', { required: 'Schedule is required' })}
              placeholder="e.g., Mon & Wed 18:00-20:00"
            />
          </FormField>

          <FormField
            label="Duration"
            error={errors.duration?.message}
            required
          >
            <Input
              {...register('duration', { required: 'Duration is required' })}
              placeholder="e.g., 10 weeks"
            />
          </FormField>

          <FormField
            label="Price (NOK)"
            error={errors.price?.message}
            required
          >
            <Input
              {...register('price', { required: 'Price is required' })}
              placeholder="e.g., 8500"
            />
          </FormField>

          <FormField
            label="Maximum Students"
            error={errors.maxStudents?.message}
            required
          >
            <Input
              type="number"
              {...register('maxStudents', { 
                required: 'Maximum students is required',
                min: { value: 1, message: 'Must be at least 1' },
                max: { value: 20, message: 'Cannot exceed 20 students' }
              })}
            />
          </FormField>

          <FormField
            label="Start Date"
            error={errors.startDate?.message}
            required
          >
            <Input
              type="date"
              {...register('startDate', { required: 'Start date is required' })}
            />
          </FormField>

          <FormField
            label="Course Image URL"
            error={errors.imageUrl?.message}
          >
            <Input
              {...register('imageUrl')}
              onChange={(e) => setImagePreview(e.target.value)}
              placeholder="Enter image URL"
            />
            {imagePreview && (
              <div className="mt-2 relative h-40">
                <OptimizedImage
                  src={imagePreview}
                  alt="Course preview"
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
          </FormField>
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Saving...' : course ? 'Update Course' : 'Create Course'}
        </button>
      </div>
    </form>
  );
}