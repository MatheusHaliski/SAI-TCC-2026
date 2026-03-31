import type { DetailedHTMLProps, HTMLAttributes } from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        ar?: boolean;
        'camera-controls'?: boolean;
        'touch-action'?: string;
        'interaction-prompt'?: string;
        'auto-rotate'?: boolean;
      };
    }
  }
}
