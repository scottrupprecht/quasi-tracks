// Only update if the modal is open, will be open, or will be closed
export const shouldModalUpdate = (showProp = 'show') => (prevProps, nextProps) => {
  if (prevProps[showProp] === false && nextProps[showProp] === false) {
    return false;
  }

  return true;
};
