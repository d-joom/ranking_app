import React, { createContext, useState, useContext } from 'react';

// Context 생성
const RefreshContext = createContext();

// RefreshProvider 컴포넌트 정의
export const RefreshProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = () => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false); // 1초 후에 자동으로 상태 초기화
    }, 10000);
  };

  return (
    <RefreshContext.Provider value={{ refresh, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};

// useRefresh 커스텀 훅
export const useRefresh = () => {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error('useRefresh must be used within a RefreshProvider');
  }
  return context;
};
