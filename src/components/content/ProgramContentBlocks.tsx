import type { ProgramContentBlock } from '@/lib/content/types'

type ProgramContentBlocksProps = {
  blocks: ProgramContentBlock[]
  className?: string
}

export default function ProgramContentBlocks({ blocks, className }: ProgramContentBlocksProps) {
  return (
    <div className={className ?? 'space-y-3'}>
      {blocks.map((block, index) => {
        if (block.type === 'paragraph') {
          return (
            <p key={`p-${index}`} className="text-slate-900">
              {block.text}
            </p>
          )
        }

        return (
          <ul
            key={`list-${index}`}
            className="list-disc list-inside space-y-2 text-slate-900"
          >
            {block.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )
      })}
    </div>
  )
}
