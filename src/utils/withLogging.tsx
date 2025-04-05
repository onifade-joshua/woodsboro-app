import { useEffect } from "react";

const withLogging = <P extends object>(Component: React.ComponentType<P>) => {
  return (props: P) => {
    useEffect(() => {
      console.log(`[Component Mounted]: ${Component.name}`);
      return () => {
        console.log(`[Component Unmounted]: ${Component.name}`);
      };
    }, []);

    return <Component {...props} />;
  };
};

export default withLogging;
