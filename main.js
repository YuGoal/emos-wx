import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()

let baseUrl = "http://192.168.1.114:8081/emos-wx-api"
Vue.prototype.url = {
	register: baseUrl + "/user/register",
	login: baseUrl + "/user/login",
	searchUserSummary: baseUrl + "/user/searchUserSummary",
	checkin: baseUrl + "/checkin/checkin",
	createFaceModel: baseUrl + "/checkin/createFaceModel",
	validCanCheckIn: baseUrl + "/checkin/validCanCheckIn",
	searchTodayCheckin: baseUrl + "/checkin/searchTodayCheckin",
	searchMonthCheckin: baseUrl + "/checkin/searchMonthCheckin",
	refreshMessage: baseUrl + "/message/refreshMessage",
}

Vue.prototype.ajax = function(url, methods, data, fun) {
	uni.request({
		"url": url,
		"method": methods,
		"header": {
			token: uni.getStorageSync("token")
		},
		"data": data,
		success: function(resp) {
			if (resp.statusCode == 401) {
				uni.redirectTo({
					url: "/pages/login/login.vue"
				})
			} else if (resp.statusCode == 200 && resp.data.code == 200) {
				let data = resp.data;
				if (data.hasOwnProperty("token")) {
					let token = data.token
					uni.setStorageSync("token", token)
				}
				fun(resp)
			} else {
				uni.showToast({
					icon: "none",
					title: resp.data
				})
			}
		}
	})
}

Vue.prototype.checkPermission = function(perms) {
	let permission = uni.getStorageSync("permission");
	let result =false
	for (let one of perms) {
		if(permission.indexOf(one)!=-1){
			result = true;
			break
		}
	}
	return result;
}
