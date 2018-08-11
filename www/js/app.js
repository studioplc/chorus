angular.module("chorus", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","ionicLazyLoad","chorus.controllers", "chorus.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "Chorus" ;
		$rootScope.appLogo = "data/images/header/logo.png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = false ;

		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "chorus",
				storeName : "chorus",
				description : "The offline datastore for Chorus app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}


			//required: cordova plugin add onesignal-cordova-plugin --save
			if(window.plugins && window.plugins.OneSignal){
				window.plugins.OneSignal.enableNotificationsWhenActive(true);
				var notificationOpenedCallback = function(jsonData){
					try {
						$timeout(function(){
							$window.location = "#/chorus/" + jsonData.notification.payload.additionalData.page ;
						},200);
					} catch(e){
						console.log("onesignal:" + e);
					}
				}
				window.plugins.OneSignal.startInit("99fc08ce-007b-49e2-b6fb-96840405c909").handleNotificationOpened(notificationOpenedCallback).endInit();
			}


		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("chorus.actualites");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("phpTime", function(){
		return function (input) {
			var timeStamp = parseInt(input) * 1000;
			return timeStamp ;
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("fr");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("fr");
})


.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$httpProvider,$ionicConfigProvider){
	try{
		// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("chorus",{
		url: "/chorus",
			abstract: true,
			templateUrl: "templates/chorus-side_menus.html",
			controller: "side_menusCtrl",
	})

	.state("chorus.about_us", {
		url: "/about_us",
		views: {
			"chorus-side_menus" : {
						templateUrl:"templates/chorus-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("chorus.actualites", {
		url: "/actualites",
		cache:false,
		views: {
			"chorus-side_menus" : {
						templateUrl:"templates/chorus-actualites.html",
						controller: "actualitesCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("chorus.actualites_bookmark", {
		url: "/actualites_bookmark",
		views: {
			"chorus-side_menus" : {
						templateUrl:"templates/chorus-actualites_bookmark.html",
						controller: "actualites_bookmarkCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("chorus.actualites_singles", {
		url: "/actualites_singles/:id",
		cache:false,
		views: {
			"chorus-side_menus" : {
						templateUrl:"templates/chorus-actualites_singles.html",
						controller: "actualites_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '<button id="fab-up-button" ng-click="scrollTop()" class="button button-fab button-fab-bottom-right button-energized-900 spin"><i class="icon ion-arrow-up-a"></i></button>',
						controller: function ($timeout) {
							$timeout(function () {
								document.getElementById("fab-up-button").classList.toggle("on");
							}, 900);
						}
					},
		}
	})

	.state("chorus.bands", {
		url: "/bands",
		cache:false,
		views: {
			"chorus-side_menus" : {
						templateUrl:"templates/chorus-bands.html",
						controller: "bandsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("chorus.bookmarks", {
		url: "/bookmarks",
		views: {
			"chorus-side_menus" : {
						templateUrl:"templates/chorus-bookmarks.html",
						controller: "bookmarksCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("chorus.chant", {
		url: "/chant",
		cache:false,
		views: {
			"chorus-side_menus" : {
						templateUrl:"templates/chorus-chant.html",
						controller: "chantCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("chorus.coding", {
		url: "/coding",
		cache:false,
		views: {
			"chorus-side_menus" : {
						templateUrl:"templates/chorus-coding.html",
						controller: "codingCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("chorus.dashboard", {
		url: "/dashboard",
		views: {
			"chorus-side_menus" : {
						templateUrl:"templates/chorus-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("chorus.francais", {
		url: "/francais",
		cache:false,
		views: {
			"chorus-side_menus" : {
						templateUrl:"templates/chorus-francais.html",
						controller: "francaisCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("chorus.guitare", {
		url: "/guitare",
		cache:false,
		views: {
			"chorus-side_menus" : {
						templateUrl:"templates/chorus-guitare.html",
						controller: "guitareCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("chorus.maths", {
		url: "/maths",
		cache:false,
		views: {
			"chorus-side_menus" : {
						templateUrl:"templates/chorus-maths.html",
						controller: "mathsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("chorus.philosophie", {
		url: "/philosophie",
		cache:false,
		views: {
			"chorus-side_menus" : {
						templateUrl:"templates/chorus-philosophie.html",
						controller: "philosophieCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("chorus.physiquechimie", {
		url: "/physiquechimie",
		cache:false,
		views: {
			"chorus-side_menus" : {
						templateUrl:"templates/chorus-physiquechimie.html",
						controller: "physiquechimieCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("chorus.slide_tab_menu", {
		url: "/slide_tab_menu",
		cache:false,
		views: {
			"chorus-side_menus" : {
						templateUrl:"templates/chorus-slide_tab_menu.html",
						controller: "slide_tab_menuCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("chorus.tarifs", {
		url: "/tarifs",
		cache:false,
		views: {
			"chorus-side_menus" : {
						templateUrl:"templates/chorus-tarifs.html",
						controller: "tarifsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("chorus.theatreadulte", {
		url: "/theatreadulte",
		cache:false,
		views: {
			"chorus-side_menus" : {
						templateUrl:"templates/chorus-theatreadulte.html",
						controller: "theatreadulteCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("chorus.theatreenfant", {
		url: "/theatreenfant",
		cache:false,
		views: {
			"chorus-side_menus" : {
						templateUrl:"templates/chorus-theatreenfant.html",
						controller: "theatreenfantCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})


// router by user


	$urlRouterProvider.otherwise("/chorus/actualites");
});
