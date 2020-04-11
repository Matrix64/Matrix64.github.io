---
layout: post
title: "批量转换项目内图片资源"
description: "重点是在已经批量操作的基础上，还能怎么懒"
modified: 2020-04-11
tags: [Unity, git, linux]
image:
  feature: 20200411_01_01.webp
---

## 又是个新需求
之前项目里特效用的贴图很多都是jpg格式,在调整叠加模式时会因为没有透明通道出问题,现在就打算先统一到png格式,贴图的转换虽然不是什么问题,不过转换成新文件之后,还要确保老文件的关联不能丢，一番搜索之后发现了一个小trick

## 修改文件，但是不改变关联
想想看unity里保存文件关联性的其实也不是文件本身,而是meta文件，所以只要不动meta的内容,在修改文件之后,同时修改meta的命名来匹配新文件,Unity就会自动识别到新文件了

实际操作顺序应该是(以下以jpg转换到png为例):

(操作过程中不要聚焦到Unity)

  1.  批量转换.jpg到.png
  1.  删除.jpg
  1.  批量重命名.jpg.meta到.png.meta
  1.  重新聚焦到Unity,等工程重新导入文件之后, 就完成了替换

## 批量操作
原理跑通了,然后就是批处理的工作了.批量改名的工具其实还挺多,比如微软最近更新的**PowerToys**,不过既然都要批处理了,不如脚本操作一步到位.

这里给出转换用的代码, 其中图片格式转换用到了ImageMagick库.

```sh
# convert tex
for i in *.jpg
    do
        magick.exe $i ${i/%.jpg/.png}
    done
echo "Convert Tex done"

# delete jpg
rm *.jpg
echo "Remove done"

# rename meta
for m in *.jpg.meta
do
    git mv $m ${m/%.jpg.meta/.png.meta}
done
echo "Rename meta done"
```

在指定的资源目录右键git bash here,然后执行代码就行了

## 后记
仔细想想,虽然需求达成了,可这个需求本身似乎有些问题,贴图格式从jpg转到了png,贴图内容却没有任何变化,其实原本因为贴图alpha信息质量低下导致的边界颜色溢出(Bleeding)问题在图片格式转换之后依旧会存在,所以本质上想要修复错误还是得手动修改贴图内容,提高alpha通道质量后再转存png或者tga格式,残念

[1][思路来源](https://stackoverflow.com/questions/49071821/in-unity-i-want-to-bulk-convert-some-textures-from-tga-to-png-and-update-refe)
