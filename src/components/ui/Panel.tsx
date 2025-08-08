import React, { ReactNode } from 'react';

interface PanelProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

const Panel: React.FC<PanelProps> = ({ title, children, className = '' }) => (
  <div className={`panel ${className}`.trim()}>
    {title && <h2 className="panel-title">{title}</h2>}
    {children}
  </div>
);

export default Panel;
