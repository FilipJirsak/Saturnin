import { type ReactNode } from 'react';

export function DashboardSectionTitle({
                                        title,
                                        description,
                                        children
                                      }: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
        {children}
      </div>
  );
}
