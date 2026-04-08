import { useRetainerPurchase } from './RetainerContext';

const RetainerTrigger = ({
  children,
  className,
  hours,
  source,
  as: Component = 'button',
  type,
  onClick,
  ...rest
}) => {
  const { openRetainerPurchase } = useRetainerPurchase();

  const handleClick = (event) => {
    if (onClick) onClick(event);
    if (event.defaultPrevented) return;
    openRetainerPurchase({ hours, source });
  };

  return (
    <Component
      {...rest}
      type={Component === 'button' ? type || 'button' : undefined}
      className={className}
      onClick={handleClick}
    >
      {children}
    </Component>
  );
};

export default RetainerTrigger;