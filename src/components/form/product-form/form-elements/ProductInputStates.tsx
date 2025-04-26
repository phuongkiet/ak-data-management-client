import { useState } from "react";
import ComponentCard from "../../../common/ComponentCard.tsx";
import Input from "../input/ProductInputField.tsx";
import ProductLabel from "../ProductLabel.tsx";
export default function ProductInputStates() {
  const [email, setEmail] = useState("");
  const [emailTwo, setEmailTwo] = useState("");
  const [error, setError] = useState(false);

  // Simulate a validation check
  const validateEmail = (value: string) => {
    const isValidEmail =
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    setError(!isValidEmail);
    return isValidEmail;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };
  const handleEmailTwoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmailTwo(value);
    validateEmail(value);
  };
  return (
    <ComponentCard
      title="Input States"
      desc="Validation styles for error, success and disabled states on form controls."
    >
      <div className="space-y-5 sm:space-y-6">
        {/* Error Input */}
        <div>
          <ProductLabel>Email</ProductLabel>
          <Input
            type="email"
            value={email}
            error={error}
            onChange={handleEmailChange}
            placeholder="Enter your email"
            hint={error ? "This is an invalid email address." : ""}
          />
        </div>

        {/* Success Input */}
        <div>
          <ProductLabel>Email</ProductLabel>
          <Input
            type="email"
            value={emailTwo}
            success={!error}
            onChange={handleEmailTwoChange}
            placeholder="Enter your email"
            hint={!error ? "This is an success message." : ""}
          />
        </div>

        {/* Disabled Input */}
        <div>
          <ProductLabel>Email</ProductLabel>
          <Input
            type="text"
            value="disabled@example.com"
            disabled={true}
            placeholder="Disabled email"
          />
        </div>
      </div>
    </ComponentCard>
  );
}
