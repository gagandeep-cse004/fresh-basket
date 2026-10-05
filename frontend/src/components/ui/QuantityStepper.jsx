import Icon from "./Icon";

const QuantityStepper = ({ quantity, onAdd, onRemove, name = "item" }) => (
  <div className="inline-flex items-center rounded-lg bg-brand-soft text-brand">
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove one ${name}`}
      className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-brand/10"
    >
      <Icon name="minus" size={16} />
    </button>
    <span className="min-w-6 text-center text-sm font-semibold" aria-live="polite">
      {quantity}
    </span>
    <button
      type="button"
      onClick={onAdd}
      aria-label={`Add one ${name}`}
      className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-brand/10"
    >
      <Icon name="plus" size={16} />
    </button>
  </div>
);

export default QuantityStepper;
