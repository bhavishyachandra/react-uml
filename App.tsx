import React, { useState } from 'react';
import {
  ReactFlowProvider,
} from '@xyflow/react';

import SaveRestore from './SaveRestore';

export default () => {
  const [savedFlow, setSavedFlow] = useState('');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(savedFlow);
  };

  return (
    <div>
      <div className="Flow">
        <ReactFlowProvider>
          <SaveRestore onSaveFlow={setSavedFlow} />
        </ReactFlowProvider>
      </div>
      <textarea value={savedFlow} className="Output" readOnly />
      <button onClick={copyToClipboard}>Copy</button>
    </div>
  );
};
