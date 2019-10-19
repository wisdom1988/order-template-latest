<template>
  <div class="preview-wrap">
    <div class="preview">
      <h5 class="preview-title">生产施工单</h5>
    </div>
    <div class="preview-btn">
      <el-button type="primary" size="small" plain>文件</el-button>
      <el-button type="primary" size="small" plain>编辑</el-button>
      <el-button type="primary" size="small" plain>打印</el-button>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
h5 {
	margin: 0;
	padding: 0;
}
.preview {
	padding: 20px 30px;
	box-shadow: 0px 0px 14px rgba(0, 0, 0, .1);
	background: #fff;
	text-align: center;
	&:after {
		content: '';
		display: inline-block;
		padding-top: 141%;
	}
	h5 {
		margin-bottom: 25px;
		font-weight: 500;
	}
	&-wrap {
		width: 90%;
	}
	// span {
	// 	display: inline-block;
	// 	padding-top: 141%;
	// }

	&-btn {
		margin-top: 30px;
		text-align: center;
	}
}
</style>
