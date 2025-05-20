import { useState } from "react";
import ComponentCard from "../../../../common/ComponentCard.tsx";
import ProductTextArea from "../../input/product/ProductTextArea.tsx";
import ProductLabel from "../../ProductLabel.tsx";

export default function ProductTextAreaInput() {
  const [message, setMessage] = useState("");
  const [messageTwo, setMessageTwo] = useState("");
  return (
    <ComponentCard title="Textarea input field">
      <div className="space-y-6">
        {/* Default TextArea */}
        <div>
          <ProductLabel>Description</ProductLabel>
          <ProductTextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
          />
        </div>

        {/* Disabled TextArea */}
        <div>
          <ProductLabel>Description</ProductLabel>
          <ProductTextArea rows={6} disabled />
        </div>

        {/* Error TextArea */}
        <div>
          <ProductLabel>Description</ProductLabel>
          <ProductTextArea
            rows={6}
            value={messageTwo}
            error
            onChange={(e) => setMessageTwo(e.target.value)}
            hint="Please enter a valid message."
          />
        </div>
      </div>
    </ComponentCard>
  );
}
