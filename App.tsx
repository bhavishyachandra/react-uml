import React, { useState, useCallback } from 'react';
import {
  Background,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Panel,
} from '@xyflow/react';

import SaveRestore from './SaveRestore';

export default () => (
  <div>
    <div id="flow">
      <ReactFlowProvider>
        <SaveRestore />
      </ReactFlowProvider>
    </div>
    <h1>hello world</h1>
  </div>
);
