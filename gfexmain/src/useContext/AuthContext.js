import React, { createContext, useContext, useState } from 'react';
import isEqual from 'lodash/isEqual';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState({
    infoS4H: {
      documentId: '',
      cnpj: [],
      manufacturer: [],
      class: [],
      exclusivityLetter: [],
      activeNextDisabled: true,
      validatedPetro: ''
    }
  });

  const login = (userData) => {
    if (userData.profile === 'petrobras') {
      userData.isRegistered = true;
    }

    setUser((prevUser) => ({
      ...prevUser,
      ...userData,
      infoS4H: {
        ...prevUser.infoS4H,
        ...userData.infoS4H,
      },
    }));
  };

  const logout = () => {
    setUser(null);
  };

  const setActiveNext = (action) => {
    setUser((prevUser) => ({
      ...prevUser,
      infoS4H: {
        ...prevUser.infoS4H,
        activeNextDisabled: action,
      },
    }));
  }
  const setManufacturer = (aManufacturer) => {
    const bActiveNext = !aManufacturer.filter((item) => (item.status)).length ? true : false;
    setUser((prevUser) => ({
      ...prevUser,
      infoS4H: {
        ...prevUser.infoS4H,
        manufacturer: aManufacturer,
        activeNextDisabled: bActiveNext,
      },
    }));
  }
  const setAssembleInitDataPerCnpj = (aCnpj, aManufacturer, aClass) => {
    const bActiveNext = !aCnpj.length ? true : false;
    setUser((prevUser) => ({
      ...prevUser,
      infoS4H: {
        ...prevUser.infoS4H,
        cnpj: aCnpj,
        manufacturer: aManufacturer,
        class: aClass,
        activeNextDisabled: bActiveNext,
      },
    }));
  }
  const setManufClass = (aClass) => {
    const bActiveNext = !user.infoS4H.manufacturer.filter((item) => (item.status)).length ? true : false;

    setUser((prevUser) => ({
      ...prevUser,
      infoS4H: {
        ...prevUser.infoS4H,
        class: aClass,
        activeNextDisabled: bActiveNext,
      },
    }));
  }
  const setClass = (aClass) => {
    const bActiveNext = !aClass.filter((item) => (item.status)).length ? true : false;

    setUser((prevUser) => ({
      ...prevUser,
      infoS4H: {
        ...prevUser.infoS4H,
        class: aClass,
        activeNextDisabled: bActiveNext,
      },
    }));

  }

  const setExclusivityLetter = (updater) => {
    setUser((prevUser) => {
      const prevLetters = Array.isArray(prevUser.infoS4H.exclusivityLetter)
        ? prevUser.infoS4H.exclusivityLetter
        : [];

      const newExclusivityLetter =
        typeof updater === 'function' ? updater(prevLetters) : updater;

      const finalExclusivityLetter = Array.isArray(newExclusivityLetter)
        ? newExclusivityLetter
        : [];

      const allLettersCompleted = finalExclusivityLetter.every(
        (item) =>
          item.status &&
          item.localFile &&
          item.localFile !== '' &&
          item.expiredDateTime &&
          item.expiredDateTime > 0
      );

      const nextDisabled = !(finalExclusivityLetter.length === 0 || allLettersCompleted);

      const isSameLetters = isEqual(prevLetters, finalExclusivityLetter);
      const isSameNextDisabled = prevUser.infoS4H.activeNextDisabled === nextDisabled;

      if (isSameLetters && isSameNextDisabled) {
        return prevUser; // ✅ Nenhuma mudança, evita re-render
      }

      return {
        ...prevUser,
        infoS4H: {
          ...prevUser.infoS4H,
          exclusivityLetter: finalExclusivityLetter,
          activeNextDisabled: nextDisabled,
        },
      };
    });
  };

  const setExpiredDate = (updatedLetterData) => {
    setUser((prevUser) => {
      const prevLetters = Array.isArray(prevUser.infoS4H.exclusivityLetter)
        ? prevUser.infoS4H.exclusivityLetter
        : [];

      const remapEL = prevLetters.map((document) => {
        if (document.id === updatedLetterData.id) {
          return {
            ...document,
            expiredDate: updatedLetterData.expiredDate,
            expiredDateTime: updatedLetterData.expiredDateTime,
          };
        }
        return document;
      });

      const allLettersCompleted = remapEL.every(
        (item) =>
          item.status &&
          item.localFile &&
          item.localFile !== '' &&
          item.expiredDateTime &&
          item.expiredDateTime > 0
      );

      const shouldActivateNext = remapEL.length === 0 || allLettersCompleted;

      const isSameLetters = isEqual(prevLetters, remapEL);
      const isSameNextDisabled = prevUser.infoS4H.activeNextDisabled === !shouldActivateNext;

      if (isSameLetters && isSameNextDisabled) {
        return prevUser; // Nenhuma mudança, evita re-render
      }

      return {
        ...prevUser,
        infoS4H: {
          ...prevUser.infoS4H,
          exclusivityLetter: remapEL,
          activeNextDisabled: !shouldActivateNext,
        },
      };
    });
  };
  return (
    <AuthContext.Provider value={{
      user, login, logout, setUser,
      setActiveNext, setAssembleInitDataPerCnpj, setManufacturer, setManufClass, setClass,
      setExclusivityLetter, setExpiredDate
    }}>
      {children}
    </AuthContext.Provider>
  );
};