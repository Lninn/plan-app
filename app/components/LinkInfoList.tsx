import { type ILinkInfo } from "@/app/type";
import style from './LinkInfoList.module.css'


interface LinkInfoListProps {
  dataSource: ILinkInfo[];
}

export default function LinkInfoList(
  { dataSource }: LinkInfoListProps
) {
  console.log(dataSource);
  return (
    <div className={style.cardList}>
      {dataSource.map((record, idx) => {
        return (
          <div key={idx} className={style.card}>
            <div className={style.cardIcon}>
              <img src={record.icon} />
            </div>
            <a
              href={record.url}
              target='_blank'
              title={record.title}
              className={style.cardName}
            >
              {record.title}
            </a>
            <div className={style.tagList}>
              {record.tags.map(tagName => {
                return (
                  <div key={tagName} className={style.tagItem}>{tagName}</div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
