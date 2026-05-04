import { Input } from '@/components/ui/Input';

interface CheckoutFormData {
  name: string;
  email: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
}

interface CheckoutFormProps {
  data: CheckoutFormData;
  onChange: (data: CheckoutFormData) => void;
}

export function CheckoutForm({ data, onChange }: CheckoutFormProps) {
  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1] as keyof typeof data.address;
      onChange({
        ...data,
        address: { ...data.address, [addressField]: value },
      });
    } else {
      onChange({ ...data, [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Input
            label="Full Name"
            required
            value={data.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="John Doe"
          />
        </div>
        <div className="md:col-span-2">
          <Input
            type="email"
            label="Email Address"
            required
            value={data.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="john@example.com"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <h3 className="text-lg font-semibold text-chocolate-800 mb-3">Shipping Address</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Input
              label="Address Line 1"
              required
              value={data.address.line1}
              onChange={(e) => handleInputChange('address.line1', e.target.value)}
              placeholder="123 Main Street"
            />
          </div>
          <div className="md:col-span-2">
            <Input
              label="Address Line 2 (Optional)"
              value={data.address.line2}
              onChange={(e) => handleInputChange('address.line2', e.target.value)}
              placeholder="Apt, suite, etc."
            />
          </div>
          <div>
            <Input
              label="City"
              required
              value={data.address.city}
              onChange={(e) => handleInputChange('address.city', e.target.value)}
            />
          </div>
          <div>
            <Input
              label="State / Province"
              required
              value={data.address.state}
              onChange={(e) => handleInputChange('address.state', e.target.value)}
            />
          </div>
          <div>
            <Input
              label="Postal Code"
              required
              value={data.address.postal_code}
              onChange={(e) => handleInputChange('address.postal_code', e.target.value)}
            />
          </div>
          <div>
            <Input
              label="Country"
              required
              value={data.address.country}
              onChange={(e) => handleInputChange('address.country', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}