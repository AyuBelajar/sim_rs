namespace App\Http\Requests\Clinical;

use Illuminate\Foundation\Http\FormRequest;

class StoreVitalSignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'systolic_bp' => ['nullable', 'integer', 'between:40,300'],
            'diastolic_bp' => ['nullable', 'integer', 'between:20,200'],
            'pulse_rate' => ['nullable', 'integer', 'between:20,250'],
            'respiratory_rate' => ['nullable', 'integer', 'between:5,80'],
            'temperature_c' => ['nullable', 'numeric', 'between:30,45'],
            'spo2_percent' => ['nullable', 'numeric', 'between:0,100'],
            'weight_kg' => ['nullable', 'numeric', 'between:1,500'],
            'height_cm' => ['nullable', 'numeric', 'between:20,250'],
        ];
    }
}