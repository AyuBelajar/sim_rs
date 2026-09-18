namespace App\Http\Requests\Clinical;

use Illuminate\Foundation\Http\FormRequest;

class StoreSoapRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'subjective' => ['required', 'string'],
            'objective' => ['required', 'string'],
            'assessment' => ['required', 'string'],
            'plan' => ['required', 'string'],
        ];
    }
}