import * as React from 'react';

interface TabsProps {
  defaultValue: string;
  className?: string;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

interface TabsListProps {
  children: React.ReactNode;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

const TabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
}>({
  activeTab: '',
  setActiveTab: () => {},
});

export function Tabs({ defaultValue, className = '', children }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className} role="tablist">
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function TabsContent({ value, children }: TabsContentProps) {
  const { activeTab } = React.useContext(TabsContext);
  return (
    <div role="tabpanel" hidden={value !== activeTab}>
      {children}
    </div>
  );
}

export function TabsList({ children }: TabsListProps) {
  return <div className="flex space-x-2 mb-4">{children}</div>;
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);

  const onClick = () => {
    setActiveTab(value);
  };

  return (
    <button
      role="tab"
      aria-selected={value === activeTab}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg ${
        value === activeTab 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  );
}