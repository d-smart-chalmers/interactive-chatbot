import React, { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export const withDeviceType = (WrappedComponent: React.FC) => {
  return (props: React.PropsWithChildren<any>) => {
    const [isMobile, setIsMobile] = useState(
      typeof window !== 'undefined'
        ? window.innerWidth < MOBILE_BREAKPOINT
        : false,
    );

    useEffect(() => {
      const handleResize = () => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
      };

      window.addEventListener('resize', handleResize);

      // Initial check in case of SSR hydration
      handleResize();

      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return <WrappedComponent {...props} isMobile={isMobile} />;
  };
};
