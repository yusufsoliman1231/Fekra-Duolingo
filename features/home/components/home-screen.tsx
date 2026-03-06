import { FireIcon } from '@/components/icons/fire-icon';
import { GlobeIcon } from '@/components/icons/globe-icon';
import { HeartIcon } from '@/components/icons/heart-icon';
import { StarIcon } from '@/components/icons/star-icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Colors } from '@/constants/Colors';
import { rw, Sizes } from '@/constants/Responsive';
import { useLessonData } from '@/store/lesson-context';
import { useLessonStore } from '@/store/lesson-store';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function HomeScreen() {
    const router = useRouter();
    const { lesson, loading, error, locale, setLocale, loadLesson, translate } =
        useLessonData();
    const { isStarted, isComplete, streak, xp, startLesson } = useLessonStore();

    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const slideAnim = React.useRef(new Animated.Value(30)).current;

    useEffect(() => {
        loadLesson();
    }, [loadLesson]);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    const handleStartLesson = () => {
        if (lesson) {
            startLesson(lesson);
        }
        router.push('/lesson');
    };

    const toggleLocale = () => {
        setLocale(locale === 'en' ? 'es' : 'en');
    };

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>{translate('errorTitle')}</Text>
                    <Text style={styles.errorMessage}>{translate('errorMessage')}</Text>
                    <Button onPress={loadLesson} variant="primary">
                        <Button.Text>{translate('retry')}</Button.Text>
                    </Button>
                </View>
            </SafeAreaView>
        );
    }

    if (loading || !lesson) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <Animated.View style={{ opacity: fadeAnim }}>
                        <Text style={styles.loadingText}>Loading...</Text>
                    </Animated.View>
                </View>
            </SafeAreaView>
        );
    }

    const hasProgress = isStarted && !isComplete;
    const title = locale === 'es' && lesson.title_es ? lesson.title_es : lesson.title;

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View
                style={[
                    styles.content,
                    {
                        opacity: fadeAnim,
                        transform: [{ translateY: slideAnim }],
                    },
                ]}
            >
                {/* Language Toggle */}
                <View style={styles.topBar}>
                    <TouchableOpacity
                        onPress={toggleLocale}
                        style={styles.languageToggle}
                        accessibilityLabel={`Switch language to ${locale === 'en' ? 'Spanish' : 'English'}`}
                        accessibilityRole="button"
                    >
                        <GlobeIcon size={rw(20)} />
                        <Text style={styles.languageText}>
                            {locale === 'en' ? 'ES' : 'EN'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <FireIcon size={rw(24)} />
                        <Text style={styles.statValue}>{streak}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <StarIcon size={rw(24)} color={Colors.xpPurple} />
                        <Text style={styles.statValue}>{xp}</Text>
                    </View>
                </View>

                {/* Lesson Card */}
                <Card style={styles.lessonCard}>
                    <Card.Header>
                        <View style={styles.lessonIconContainer}>
                            <Text style={styles.lessonIcon}>🇪🇸</Text>
                        </View>
                    </Card.Header>
                    <Card.Body>
                        <Text style={styles.lessonTitle}>{title}</Text>
                        <Text style={styles.lessonDescription}>
                            {translate('lessonDescription')}
                        </Text>
                        <View style={styles.metaRow}>
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>{translate('estimatedTime')}</Text>
                            </View>
                            <View style={styles.metaDot} />
                            <View style={styles.metaItem}>
                                <Text style={styles.metaLabel}>
                                    {lesson.exercises.length} {translate('exercise').toLowerCase()}s
                                </Text>
                            </View>
                            <View style={styles.metaDot} />
                            <View style={styles.metaItem}>
                                <HeartIcon size={rw(14)} />
                                <Text style={styles.metaLabel}>3 {translate('hearts').toLowerCase()}</Text>
                            </View>
                        </View>
                    </Card.Body>
                    <Card.Footer>
                        <Button
                            onPress={handleStartLesson}
                            variant="primary"
                            accessibilityLabel={
                                hasProgress
                                    ? translate('resumeLesson')
                                    : translate('startLesson')
                            }
                            style={styles.startButton}
                        >
                            <Button.Text>
                                {hasProgress
                                    ? translate('resumeLesson')
                                    : translate('startLesson')}
                            </Button.Text>
                        </Button>
                    </Card.Footer>
                </Card>

                {/* XP info */}
                <View style={styles.xpInfo}>
                    <StarIcon size={rw(16)} color={Colors.xpPurple} />
                    <Text style={styles.xpInfoText}>
                        +{lesson.xp_per_correct} XP per correct answer
                    </Text>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundLight,
    },
    content: {
        flex: 1,
        paddingHorizontal: Sizes.screenPadding,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        fontSize: Sizes.fontLg,
        color: Colors.mediumText,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Sizes.xl,
        gap: Sizes.md,
    },
    errorTitle: {
        fontSize: Sizes.fontXl,
        fontWeight: '700',
        color: Colors.darkText,
        textAlign: 'center',
    },
    errorMessage: {
        fontSize: Sizes.fontMd,
        color: Colors.mediumText,
        textAlign: 'center',
        marginBottom: Sizes.md,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: Sizes.sm,
    },
    languageToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Sizes.xs,
        paddingVertical: Sizes.xs,
        paddingHorizontal: Sizes.sm,
        borderRadius: Sizes.radiusFull,
        borderWidth: 1.5,
        borderColor: Colors.borderLight,
    },
    languageText: {
        fontSize: Sizes.fontSm,
        fontWeight: '700',
        color: Colors.secondary,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Sizes.xl,
        paddingVertical: Sizes.md,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Sizes.xs,
    },
    statValue: {
        fontSize: Sizes.fontLg,
        fontWeight: '700',
        color: Colors.darkText,
    },
    lessonCard: {
        marginTop: Sizes.lg,
    },
    lessonIconContainer: {
        alignItems: 'center',
    },
    lessonIcon: {
        fontSize: rw(48),
    },
    lessonTitle: {
        fontSize: Sizes.fontXl,
        fontWeight: '700',
        color: Colors.darkText,
        textAlign: 'center',
        marginBottom: Sizes.xs,
    },
    lessonDescription: {
        fontSize: Sizes.fontMd,
        color: Colors.mediumText,
        textAlign: 'center',
        marginBottom: Sizes.md,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Sizes.sm,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Sizes.xs,
    },
    metaLabel: {
        fontSize: Sizes.fontXs,
        color: Colors.mediumText,
        fontWeight: '600',
    },
    metaDot: {
        width: rw(4),
        height: rw(4),
        borderRadius: rw(2),
        backgroundColor: Colors.lightText,
    },
    startButton: {
        width: '100%',
    },
    xpInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Sizes.xs,
        marginTop: Sizes.lg,
    },
    xpInfoText: {
        fontSize: Sizes.fontSm,
        color: Colors.mediumText,
    },
});
