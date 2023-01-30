import React from 'react';

const ExpandingIframe = ({ src }) => {
  const [frameHeight, setFrameHeight] = React.useState(0);

  const handleResize = () => {
    setFrameHeight(800)//document.querySelector('.container').clientHeight);
  };

  React.useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <iframe
      className="expanding-iframe"
      src={src}
      frameBorder="0"
      style={{ width: '100%', height: `${frameHeight}px` }}
    />
  );
};

export default ExpandingIframe;
