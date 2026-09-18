namespace App\Http\Requests\Clinical;

use Illuminate\Foundation\Http\FormRequest;

class StorePrescriptionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'notes' => ['nullable', 'string'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.item_name' => ['required', 'string', 'max:255'],
            'items.*.dosage' => ['required', 'string', 'max:100'],
            'items.*.frequency' => ['required', 'string', 'max:100'],
            'items.*.route' => ['nullable', 'string', 'max:50'],
            'items.*.duration' => ['nullable', 'string', 'max:50'],
            'items.*.quantity' => ['required', 'numeric', 'min:1'],
            'items.*.unit' => ['required', 'string', 'max:50'],
            'items.*.instructions' => ['nullable', 'string'],
        ];
    }
}
