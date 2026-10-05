import Icon from "./Icon";

const EmptyState = ({ icon = "package", title, text, children }) => (
  <div className="card mx-auto my-10 flex max-w-md flex-col items-center px-6 py-12 text-center">
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
      <Icon name={icon} size={26} />
    </span>
    <h2 className="mt-5 text-xl font-semibold">{title}</h2>
    {text && <p className="mt-2 text-sm text-muted">{text}</p>}
    {children && <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>}
  </div>
);

export default EmptyState;
