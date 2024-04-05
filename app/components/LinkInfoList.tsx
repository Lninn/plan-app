import { type ILinkInfo } from "@/app/type";


interface LinkInfoListProps {
  dataSource: ILinkInfo[];
}

export default function LinkInfoList(
  { dataSource }: LinkInfoListProps
) {
  return (
    <div className='data-list'>
      {dataSource.map((record, idx) => {
        return (
          <div key={idx} className='card'>
            <div className='card-icon'>
              <img src={record.icon} />
            </div>
            <a
              href={record.url}
              target='_blank'
              title={record.title}
              className='card-name'
            >
              {record.title}
            </a>
            <div className='card-tagList'>
              {record.tags.map(tagName => {
                return (
                  <div key={tagName} className='tag'>{tagName}</div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
