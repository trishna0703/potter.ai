import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "#components/ui/breadcrumb";

import { Link, useLocation } from "react-router-dom";

interface BreadcrumbConfig {
    [key: string]: {
        label: string;
        path?: string;
    };
}
interface CustomBreadcrumbProps {
    config?: BreadcrumbConfig;
}

const CustomBreadcrumb = ({ config = {} }: CustomBreadcrumbProps) => {
    const location = useLocation();

    const segments = location.pathname.split("/").filter(Boolean);

    const breadcrumbs = segments.map((segment, index) => {
        const defaultPath = `/${segments.slice(0, index + 1).join("/")}`;

        const item = config[segment];

        return {
            label:
                item?.label ||
                segment
                    .replace(/[-_]/g, " ")
                    .replace(/\b\w/g, (char) => char.toUpperCase()),
            path: item?.path ?? defaultPath,
            isLast: index === segments.length - 1,
        };
    });

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink>Home</BreadcrumbLink>
                </BreadcrumbItem>

                {breadcrumbs.map((breadcrumb) => (
                    <div key={breadcrumb.label} className="contents">
                        <BreadcrumbSeparator />

                        <BreadcrumbItem>
                            {breadcrumb.isLast ? (
                                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink render={<Link to={breadcrumb.path} />}>
                                    {breadcrumb.label}
                                </BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </div>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default CustomBreadcrumb;
