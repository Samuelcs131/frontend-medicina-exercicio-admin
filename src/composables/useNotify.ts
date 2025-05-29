import { Notify } from 'quasar';
import type { QPosition } from 'src/enums/quasar/position.enum';
import type { QType } from 'src/enums/quasar/type.enum';

export function useNotify() {
  function feedback(opt: {
    type: `${QType}`;
    position: `${QPosition}`;
    title: string;
    description?: string;
    progress?: boolean;
    timeout?: number;
  }) {
    opt.progress = true;

    Notify.create({
      timeout: opt.timeout || 5000,
      progress: opt.progress || true,
      message: opt.title,
      position: opt.position,
      caption: opt.description || '',
      type: opt.type,
      actions: [
        {
          icon: 'close',
          color: 'white',
          size: 'sm',
          flat: true,
          round: true,
        },
      ],
    });
  }

  return {
    feedback,
  };
}
