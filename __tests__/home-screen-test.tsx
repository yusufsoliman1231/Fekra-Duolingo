import { render } from '@testing-library/react-native';

import { HomeScreen } from '@/features/home/components/home-screen';

// Mock react-native-svg
jest.mock('react-native-svg', () => {
    const { View } = require('react-native');
    return {
        __esModule: true,
        default: View,
        Svg: View,
        Path: View,
        Circle: View,
        Rect: View,
        G: View,
    };
});

// Mock the lesson context
jest.mock('@/store/lesson-context', () => ({
    useLessonData: () => ({
        lesson: {
            id: 'test',
            title: 'Test Lesson',
            exercises: [],
            xp_per_correct: 10,
            streak_increment: 1,
        },
        loading: false,
        error: null,
        locale: 'en',
        setLocale: jest.fn(),
        loadLesson: jest.fn(),
        translate: (key: string) => key,
    }),
}));

// Mock the lesson store
jest.mock('@/store/lesson-store', () => ({
    useLessonStore: () => ({
        isStarted: false,
        isComplete: false,
        streak: 3,
        xp: 50,
        startLesson: jest.fn(),
    }),
}));

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => {
    const { View } = require('react-native');
    return {
        SafeAreaView: View,
        SafeAreaProvider: View,
    };
});

// Mock navigation
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
    }),
}));

describe('<HomeScreen />', () => {
    it('renders without crashing', () => {
        const { getByText } = render(<HomeScreen />);
        expect(getByText('Test Lesson')).toBeTruthy();
    });
});
