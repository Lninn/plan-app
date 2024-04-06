import style from './URLResolveDrawer.module.css'

import { useState } from "react"
import { Button, Drawer, Flex, Form, Input, message } from "antd"
import Editor from "./JSONEditor"
import { CopyOutlined, ImportOutlined } from "@ant-design/icons"
import { JSONEditorPropsOptional } from 'vanilla-jsoneditor'
import type { Content } from 'vanilla-jsoneditor';
import { type CategorizedTagInfo } from "@/app/type"


const AI_LIST = [
  {
    icon: 'https://statics.moonshot.cn/kimi-chat/favicon.ico',
    url: 'https://kimi.moonshot.cn/',
    title: 'Kimi.ai'
  },
  {
    icon: 'https://nlp-eb.cdn.bcebos.com/logo/favicon.ico',
    url: 'https://yiyan.baidu.com/',
    title: '文言一心'
  }
]

const getPromptTemplate = (content: string) => {
  return `我提供了一个 "input" url列表给你，请对每一个 URL 分析，并给出最适合当前 URL 的名称和标签，标签数量至少1个，最多5个。最后以 javascript 数组Array<Datum> 的结构整理后输出：

  interface Datum {
    title: string
    url: string
    tags: string[]
  }

  ${content}
`
}

interface URLResolveDrawerProps {
  open: boolean;
  onClose: () => void;
  submit: (record: Pick<CategorizedTagInfo, 'title' | 'url' | 'tags'>[]) => void;
}

export default function URLResolveDrawer(
  props: URLResolveDrawerProps,
) {
  const { open, onClose, submit } = props;

  const [sourceForm] = Form.useForm()

  const [editThemeFormatRight, setEditThemeFormatRight] = useState<boolean>(true);
  const [themeConfigContent, setThemeConfigContent] = useState<Content>({
    text: undefined,
    json: [
      {  
        "title": "NetSpeak",  
        "url": "https://netspeak.org/",  
        "tags": ["语言学习", "在线词典", "交流工具"]  
      },  
      {  
        "title": "Linggle",
        "url": "https://linggle.com/",  
        "tags": ["英语学习", "例句搜索", "语言研究"]
      },  
      {  
        "title": "CSS-Tricks",  
        "url": "https://css-tricks.com/",  
        "tags": ["CSS教程", "前端开发", "设计技巧", "网页样式"]  
      },  
      {  
        "title": "Open Props",  
        "url": "https://open-props.style/",  
        "tags": ["CSS属性", "前端开发", "样式指南", "开源资源"]  
      }  
    ],
  });

  async function importDataToTable() {
    try {
      if (!editThemeFormatRight) {
        message.error('请先切换到 JSON 格式')
        return;
      }

      let resultList = (
        ('json' in themeConfigContent ? themeConfigContent.json : []) as CategorizedTagInfo[])

      if (!Array.isArray(resultList)) {
        message.error('只支持 Array 格式')
        return
      }

      if (resultList.length === 0) {
        resultList = tryGetFromText()
      }

      sourceForm.resetFields()
      setThemeConfigContent({
        text: undefined,
        json: null,
      })
      onClose();

      const nextDataList= resultList.map(({
        title,
        url,
        tags,
      }) => ({
        title,
        url,
        tags,
      }))
      submit(nextDataList)
    } catch (errorInfo) {
      if (errorInfo instanceof Error) {
        // console.log(errorInfo)
        message.error(errorInfo.message)
      }
    }
  }

  function tryGetFromText() {
    try {
      const inputStr = 'text' in themeConfigContent ? themeConfigContent.text : '';
      const resultList = JSON.parse(inputStr)

      if (!Array.isArray(resultList)) {
        throw new Error('数据格式错误')
      } else if (resultList.length === 0) {
        throw new Error('数据不能为空')
      }

      return resultList
    } catch (error) {
      throw new Error('数据不能为空')
    }

    return []
  }

  async function copyAsPrompt() {
    try {
      const values = await sourceForm.validateFields()
      const initData: string = values.data
      const validData = initData.split('\n').map(val => val.trim())
      console.log('[copyAsPrompt]', validData)

      const content = `input = ${JSON.stringify(validData)}`
      await copyToClipboard(content)
    } catch (error) {
      //
    }
  }

  // inject content to clipboard
  async function copyToClipboard(content: string) {
    try {
      const finalContent = getPromptTemplate(content)
      await navigator.clipboard.writeText(finalContent)
      message.success('复制成功')
    } catch (e) {
      message.error('复制失败')
    }
  }

  const handleEditConfigChange: JSONEditorPropsOptional['onChange'] = (
    newcontent,
    _,
    status
  ) => {
    setThemeConfigContent(newcontent);

    console.log({ newcontent, status })

    if (
      (
        status &&
        status.contentErrors &&
        'validationErrors' in status.contentErrors &&
        Array.isArray(status.contentErrors.validationErrors) &&
        status.contentErrors.validationErrors.length === 0
      ) || (
        status &&
        !status.contentErrors
      )
    ) {
      setEditThemeFormatRight(true);
    } else {
      setEditThemeFormatRight(false);
    }
  };

  return (
    <Drawer
      title="数据源"
      placement='right'
      closable={false}
      onClose={onClose}
      open={open}
      width={600}
    >
      <Form form={sourceForm} layout='vertical' initialValues={{
        data: `https://netspeak.org/
        https://linggle.com/
        https://css-tricks.com/
        https://open-props.style/`
      }}>
        <Form.Item name='data'>
          <Input.TextArea
            autoSize={{ minRows: 10 }}
            placeholder="请输入，每行一个域名"
          />
        </Form.Item>
      </Form>
      
      <Flex align='center' style={{ marginBlockEnd: 16 }}>
        <Button
          type='primary'
          onClick={copyAsPrompt}
          icon={<CopyOutlined />}
        >
          复制到剪切板
        </Button>
        <div className={style.aiOptions}>
          {AI_LIST.map((record, idx) => {
            return (
              <a key={idx} href={record.url} target='_blank' title={record.title}>
                <img src={record.icon} alt={record.title} />
              </a>
            )
          })}
        </div>
      </Flex>

      <Editor
        content={themeConfigContent}
        onChange={handleEditConfigChange}
        mainMenuBar={false}
      />

      <Button
        type='primary'
        onClick={importDataToTable}
        icon={<ImportOutlined />}
      >
        导入
      </Button>
    </Drawer>
  )
}
