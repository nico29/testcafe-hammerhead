// -------------------------------------------------------------
// WARNING: this file is used by both the client and the server.
// Do not use any browser or node-specific API!
// -------------------------------------------------------------

import { createLocationSetWrapper } from '../node-builder';
import { Syntax } from 'esotope-hammerhead';

// Transform:
// location = value -->
// (function(){ return __set$Loc(location, value) || location = value;}.apply(this))

export default {
    nodeReplacementRequireTransform: false,

    nodeTypes: [Syntax.AssignmentExpression],

    condition: node => node.operator === '=' &&
                       node.left.type === Syntax.Identifier &&
                       node.left.name === 'location',

    run: (node, parent, key) => {
        const wrapWithSequence = key !== 'arguments' && key !== 'consequent' && key !== 'alternate' &&
                               (parent.type !== Syntax.SequenceExpression || parent.expressions[0] === node);

        return createLocationSetWrapper(node.right, wrapWithSequence);
    }
};
