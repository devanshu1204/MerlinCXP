import { Link as ILink, LinkProps as ILinkProps } from 'react-router-dom';

import { ReactNode, forwardRef } from 'react';

type CustomLinkProps = Omit<ILinkProps, 'href'> & {
	to?: string;
	href?: string;
	children?: ReactNode;
	className?: string;
	role?: string;
};

const Link = forwardRef<HTMLAnchorElement, CustomLinkProps>(({ to, href, children, className, role, ...rest }, ref) => {
	return (
		<ILink
			className={className}
			to={to || href}
			role={role}
			ref={ref}
			{...rest}
		>
			{children}
		</ILink>
	);
});

export default Link;
