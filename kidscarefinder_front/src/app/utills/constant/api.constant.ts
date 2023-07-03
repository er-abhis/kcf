export const API = {
  // Login, Logout, Signup, OTP API
  login: '/account/signin/',
  signup: '/account/signup/',
  otpApi: '/account/account_activate_otp_verify/',
  forgotAPI: '/account/password_reset/',
  resetOTPVerify: '/account/reset_pass_otp_verify/',
  forgotPassOtpVerify: '/account/verify-otp',
  accountActivateOtp: '/account/account-activate-otp',
  // provider API
  providerBasicInfo: '/provider/basicinfo',
  provActivity: '/account/myprovider/',
  affiliatedprovider: '/provider/affiliatedprovider/',
  addAffiliatedprovider: '/provider/affiliated',
  getAffiliatedProvider: '/provider/affiliated/',
  providerDashboard: '/provider/userdata/',
  myprovider: '/account/myprovider/',
  providerFilters: '/provider/providerFilters/',
  favourite: '/favourite/favourite/',
  updatefavourite: '/favourite/favourite',
  providerSchedule: '/scheduler/schedule',
  providerLicense: '/license/license',
  providerWebsite: '/provider/basicinfo/',
  providerAgeGroup: '/availability/agegroupcategory',
  providerAgeGroupSave: '/availability/agegroup',
  providerLicenseInfo: '/license/license/',
  providerGetAgeGroup: '/availability/agegroup/',
  providerChangePassword: '/account/change_password/',
  photo: '/file_upload/',
  video: '/provider/basicinfo/',
  videoPhoto: '/provider/basicinfo/',
  childRequiremnet: '/provider/childrequirement/',
  childRequiremnets: '/provider/basicinfo/',
  providerAddress: '/address/address/',

  meals: '/meals/meals',
  snacks: '/meals/snacks',

  mealsGet: '/meals/meals/',
  snacksGet: '/meals/snacks/',

  teachersChild: '/agegroup/teacherchildratio',
  getteachersChild: '/availability/agegroup/',

  tuitions: '/widgets/tuitionfees',

  affiliation: '/provider/affiliation/',
  affiliationGet: '/provider/basicinfo/',

  adminSettings: '/notifications/notification',
  adminAddWithSettings: '/administrator/administrator',
  getAdminNotifications: '/notifications/notification/1/',
  getAllAdmins: '/administrator/administrator/',

  //user API
  userDetailsUpdate: '/account/UserDetailsUPdate/',
  providerSignup: '/account/signup/',
  userbasic: '/account/signup/',
  proPicUpload: '/account/signup/',
  userDetails: '/account/useraccount/',
  userChangePass: '/account/change_password/',
  usernameChange: '/account/change_username/',
  addChild: '/account/child_pregnancy/',
  addPregnancy: '/account/child_pregnancy/',
  getChild: '/account/child_pregnancy/',
  addPedia: '/medicalcontacts/pediatrician',
  getPedia: '/medicalcontacts/pediatrician/',
  addDentist: '/medicalcontacts/dentist',
  getDentist: '/medicalcontacts/dentist/',
  sharingMessgae: '/account/sharingmessage/',
  parentAdd: '/peopleinfo/parentguardian',
  getparentAdd: '/peopleinfo/parentguardian/',
  authPerson: '/peopleinfo/authorizedpeople',
  getauthPerson: '/peopleinfo/authorizedpeople/',
  getProvider: '/provider/category',
  getNotify: '/messenger/messagecount/1/',
  healthHistory: '/account/child_pregnancy/',
  illnessData: '/account/childillness/',
  getIllness: '/widgets/illness',
  addWaitlist: '/account/requestapplications/',

  // Edit APis
  editDentist: '/medicalcontacts/dentist/',
  editPedia: '/medicalcontacts/pediatrician/',
  editParent: '/peopleinfo/parentguardian/',
  editAuthPerson: '/peopleinfo/authorizedpeople/',
  editChild: '/account/child_pregnancy/',
  // messenger API
  sendMessage: '/messenger/message',
  message: '/messenger/message',
  roomMessages: '/messenger/room/',
  allRooms: '/messenger/allrooms',
  providerSearch: '/account/search/',
  searchDetails: '/search/details/',
  // provider enrollment API
  enrollmentRequests: '/account/requestapplications/',
  // provider applications API
  requestApplications: '/account/requestapplications/',
  viewApplications: '/account/application/',
  // provider notification API
  providerNotification: '/notifications/notification/1/',
  // Preschool Result Page API
  searchData: '/search/search?',
  // provider waitlist API
  userWaitlist: '/account/user_waitlist/',

  //ApplyOnlineAPI
  userAccount: '/account/useraccount/',
  parentInfo: '/peopleinfo/parentguardian/',
  childAccount: '/account/child_pregnancy/',
  providerInfo: '/provider/basicinfo/',
  postApplyOnline: '/account/requestapplications/',

  // Delete API's Start
  deleteParent: '/peopleinfo/parentguardian/',
  deleteAuthorized: '/peopleinfo/authorizedpeople/',
  deletePedia: '/medicalcontacts/pediatrician/',
  deleteDentist: '/medicalcontacts/dentist/',
  deleteChild: '/account/child_pregnancy/',
  // Delete API's End

  // Payment API's
  bankAccount: '/account/bankaccount',
  subscription: '/subscription/provider_subscription/',
  cardDetails: '/account/carddetails',

  // Review & Rating API's
  review: '/reviews/review',
  reviews: '/reviews/review/',
  rating: '/reviews/avgrating',

  // languge
  language: '/widgets/languages',
  // religion
  religion: '/widgets/religion',
  //search provider
  searchProvBYProvidername: '/provider/search-provider-by-name/',
  // docuSign
  call_docuSign: '/docusign/call_pdf/',
  embeddedSignature: '/docusign/docusign_signature/',
  envelopeStatus: '/docusign/get_envelope_status/',
  getSignatured_document: '/docusign/get_document/',
  upload_docfiles: '/account/childpregnancy/',
  checkStatus: '/account/child_pregnancy',


  // ************************ For daycare center API start *************************************
  daycareproviderAgeGroupSave: '/availability/daycarecenter/agegroup',
  daycareproviderGetAgeGroup: '/availability/daycarecenter/agegroup/',
  daycarecenterchildRequiremnet: '/provider/daycarecenter/childrequirement/',
  daycareteachersAdult: '/agegroup/daycarecenter/teacheradultratio',
  getdaycareteachersAdult: '/availability/daycarecenter/agegroup/',



  // ************************ For daycare center API end ***************************************

};
