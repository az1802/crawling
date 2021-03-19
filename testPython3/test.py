'''
Author: your name
Date: 2021-02-22 18:43:26
LastEditTime: 2021-02-22 18:57:15
LastEditors: Please set LastEditors
Description: In User Settings Edit
FilePath: /crawling/test.py
'''
from urllib3 import encode_multipart_formdata
header = {"Content-Type" : "multipart/form-data"}
data = {
“key”:"value"
}
filename = 'file'
filepath = 'Users/zhiyi/Desktop/work/crawling/testPython3'
#在data中增加文件key/value
data['appFile']= (filename,open(filepath,'rb').read())
#转换data数据的类型
encode_data = encode_multipart_formdata(data)
data = encode_data[0]
header['Content-Type'] = encode_data[1]
res = requests.post(url=url, headers=header, data=data)
print(res)
print(res.text)
print(res.content.decode('utf-8'))