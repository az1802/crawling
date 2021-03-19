'''
Author: your name
Date: 2021-02-22 18:58:40
LastEditTime: 2021-02-22 19:02:46
LastEditors: Please set LastEditors
Description: In User Settings Edit
FilePath: /crawling/testPython3/formData.py
'''
def encode_multipart_formdata(fields, files):

  boundary = '---------------------------7e229e1a230202'
  crlf = '\r\n'
  l = []

  for (key, value) in fields:
      # name: 标签名
      # value : 标签对应的值
      l.append('--' + boundary)
      l.append('Content-Disposition: form-data; name="%s"' % key)
      l.append('')
      l.append(value)

  for (key, filename, value) in files:
      # key : 标签名
      # filename : 文件名
      # value 文件内容
      filename = filename
      l.append('--' + boundary)
      l.append(
          'Content-Disposition: form-data; name="%s"; filename="%s"' % (
              key, filename
          )
      )
      l.append('Content-Type: image/x-png')
      l.append('')
      l.append(value)
  l.append('--' + boundary + '--')
  l.append('')
  # 以 \r\n 为分隔符将列表链接为字符串
  body = crlf.join(l)
  content_type = 'multipart/form-data; boundary=%s' % boundary
  return content_type, body