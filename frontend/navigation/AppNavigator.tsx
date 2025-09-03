import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTab from "./BottomTab";
import { AuthContext } from "../src/contexts/AuthContext"; 

// Auth Screens
import LoginScreen from "../screens/Auth/LoginScreen";
import RegisterScreen from "../screens/Auth/RegisterScreen";
import OTPScreen from "../screens/Auth/OTPScreen";
import ProfileScreen from "../screens/Auth/ProfileScreen";
import UserManagementScreen from "../screens/Auth/UserManagementScreen"

// Subject Screens
import SubjectListScreen from "../screens/Subject/SubjectListScreen";
import AddSubjectScreen from "../screens/Subject/AddSubjectScreen";
import EditSubjectScreen from "../screens/Subject/EditSubjectScreen";

// Course Screens
import CourseListScreen from "../screens/Course/CourseListScreen";
import AddCourseScreen from "../screens/Course/AddCourseScreen";
import EditCourseScreen from "../screens/Course/EditCourseScreen";
import EditCourseScheduleScreen from "../screens/Schedule/EditCourseScheduleScreen";
import ScheduleListScreen from "../screens/Schedule/ScheduleListScreen";
import CourseDetailScreen from "../screens/Course/CourseDetailScreen";

// Lesson Screens
import LessonListScreen from "../screens/Lesson/LessonListScreen";
import AddLessonScreen from "../screens/Lesson/AddLessonScreen";
import EditLessonScreen from "../screens/Lesson/EditLessonScreen";
import LessonDetailScreen from "../screens/Lesson/LessonDetailScreen";

// Assignment Screens
import AssignmentListScreen from "../screens/Assignment/AssignmentListScreen";
import AssignmentDetailScreen from "../screens/Assignment/AssignmentDetailScreen";
import AddAssignmentScreen from "../screens/Assignment/AddAssignmentScreen";
import EditAssignmentScreen from "../screens/Assignment/EditAssignmentScreen";

// Submission Screens
import SubmitAssignmentScreen from "../screens/Submission/SubmitAssignmentScreen";
import GradeSubmissionScreen from "../screens/Submission/GradeSubmissionScreen";
import SubmissionDetailScreen from "../screens/Submission/SubmissionDetailScreen";
import SubmittedAssignmentsScreen from "../screens/Submission/SubmittedAssignmentsScreen";
import SubmittedAssignmentDetailScreen from "../screens/Submission/SubmittedAssignmentDetailScreen";

// Registration Screens
import RegistrationListScreen from "../screens/Registration/RegistrationListScreen";
import AddRegistrationScreen from "../screens/Registration/AddRegistrationScreen";
import EditRegistrationScreen from "../screens/Registration/EditRegistrationScreen";
import RegisterCourseDetailScreen from "../screens/Registration/RegisterCourseDetailScreen";
import RegisterTimeScreen from "../screens/Registration/RegisterTimeScreen";

// ClassMember Screens
import StudentCourseListScreen from "../screens/ClassMember/StudentCourseListScreen";
import StudentRegisteredCoursesScreen from "../screens/ClassMember/StudentRegisteredCoursesScreen";
import AdminClassMemberListScreen from "../screens/ClassMember/AdminClassMemberListScreen";
import CheckoutListScreen from "../screens/ClassMember/CheckoutListScreen";
import TeacherStudentListScreen from "../screens/ClassMember/TeacherStudentListScreen";

import AdminUserListScreen from "../screens/Timetable/AdminUserListScreen";
import UserTimetableScreen from "../screens/Timetable/UserTimetableScreen";

// Types
import { Submission } from "../screens/Submission/SubmittedAssignmentsScreen";

export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Register: undefined;
  OTP: { name: string; email: string; password: string };
  Profile: { user: any };
  UserManagement: undefined;

  SubjectList: undefined;
  AddSubject: undefined;
  EditSubject: { id: number };

  CourseList: undefined;
  AddCourse: undefined;
  EditCourse: { id: number };
  EditCourseSchedule: { schedule: any };
  ScheduleList: { courseId: number };
  CourseDetail: { courseId: number };

  LessonList: { courseId: number };
  AddLesson: { courseId: number };
  EditLesson: { lessonId: number; courseId: number };
  LessonDetail: { lessonId: number };

  AssignmentList: { lessonId: number };
  AssignmentDetail: { assignment: any };
  AddAssignmentScreen: { lessonId: number };
  EditAssignmentScreen: { assignmentId: number };

  SubmitAssignmentScreen: { assignment: any };
  GradeSubmissionScreen: { submission: any };
  SubmissionDetail: { submission: any };
  SubmittedAssignments: undefined;
  SubmittedAssignmentDetail: { submission: Submission };

  RegistrationList: undefined;
  AddRegistration: undefined;
  EditRegistration: undefined;
  RegisterCourseDetail: { registerId: number };
  RegisterTime: undefined;

  StudentCourseList: undefined;
  StudentRegisteredCourses: undefined;
  StudentRegisterCourseDetail: { course: any };
  StudentCheckout: undefined;
  CheckoutList: { courseId: number };
  AdminClassMemberList: undefined;
  TeacherStudentList: { courseId: number };

  // Thời khóa biểu (thêm mới)
  AdminUserList: undefined;
  UserTimetable: { userId: number; userName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
      <Stack.Screen name="Main" component={BottomTab} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="UserManagement" component={UserManagementScreen} />

      {/* Subject */}
      <Stack.Screen name="SubjectList" component={SubjectListScreen} />
      <Stack.Screen name="AddSubject" component={AddSubjectScreen} />
      <Stack.Screen name="EditSubject" component={EditSubjectScreen} />

      {/* Course */}
      <Stack.Screen name="CourseList" component={CourseListScreen} />
      <Stack.Screen name="AddCourse" component={AddCourseScreen} />
      <Stack.Screen name="EditCourse" component={EditCourseScreen} />
      <Stack.Screen
        name="EditCourseSchedule"
        component={EditCourseScheduleScreen}
      />
      <Stack.Screen name="ScheduleList" component={ScheduleListScreen} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />

      {/* Lesson */}
      <Stack.Screen name="LessonList" component={LessonListScreen} />
      <Stack.Screen name="AddLesson" component={AddLessonScreen} />
      <Stack.Screen name="EditLesson" component={EditLessonScreen} />
      <Stack.Screen name="LessonDetail" component={LessonDetailScreen} />

      {/* Assignment */}
      <Stack.Screen name="AssignmentList" component={AssignmentListScreen} />
      <Stack.Screen
        name="AssignmentDetail"
        component={AssignmentDetailScreen}
      />
      <Stack.Screen
        name="AddAssignmentScreen"
        component={AddAssignmentScreen}
      />
      <Stack.Screen
        name="EditAssignmentScreen"
        component={EditAssignmentScreen}
      />

      {/* Submission */}
      <Stack.Screen
        name="SubmitAssignmentScreen"
        component={SubmitAssignmentScreen}
      />
      <Stack.Screen
        name="GradeSubmissionScreen"
        component={GradeSubmissionScreen}
      />
      <Stack.Screen
        name="SubmissionDetail"
        component={SubmissionDetailScreen}
      />
      <Stack.Screen
        name="SubmittedAssignments"
        component={SubmittedAssignmentsScreen}
      />
      <Stack.Screen
        name="SubmittedAssignmentDetail"
        component={SubmittedAssignmentDetailScreen}
      />

      {/* Registration */}
      <Stack.Screen
        name="RegistrationList"
        component={RegistrationListScreen}
      />
      <Stack.Screen name="AddRegistration" component={AddRegistrationScreen} />
      <Stack.Screen
        name="EditRegistration"
        component={EditRegistrationScreen}
      />
      <Stack.Screen
        name="RegisterCourseDetail"
        component={RegisterCourseDetailScreen}
      />
      <Stack.Screen
        name="RegisterTime"
        component={RegisterTimeScreen}
        options={{ title: "Quản Lý Thời Gian Đăng Ký" }}
      />

      {/* ClassMember */}
      <Stack.Screen
        name="StudentCourseList"
        component={StudentCourseListScreen}
      />
      <Stack.Screen
        name="StudentRegisteredCourses"
        component={StudentRegisteredCoursesScreen}
      />
      <Stack.Screen
        name="AdminClassMemberList"
        component={AdminClassMemberListScreen}
      />
      <Stack.Screen
        name="CheckoutList"
        component={CheckoutListScreen}
        options={{ title: "Danh sách Checkout" }}
      />
      <Stack.Screen
        name="TeacherStudentList"
        component={TeacherStudentListScreen}
        options={{ title: "Danh sách sinh viên" }}
      />
      <Stack.Screen
        name="AdminUserList"
        component={AdminUserListScreen}
        options={{ title: "Danh sách người dùng" }}
      />

      <Stack.Screen
        name="UserTimetable"
        component={UserTimetableScreen}
        options={{ title: "Thời khóa biểu" }}
        />
      </>
      ) : (
         <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="OTP" component={OTPScreen} />
        </>
        )}
    </Stack.Navigator>
  );
}
