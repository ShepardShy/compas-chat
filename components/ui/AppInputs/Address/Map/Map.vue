<template>
    <div class="map">
        <MapTop
            v-if="props.isSelectSeveral && !props.isReadOnly"
            :drawButtonActive="drawButtonActive"
            @toggleDraw="(status) => toggleDraw(status)"
        />

        <div class="map__wrapper">
            <YandexMap
                v-model="map"
                :settings="{
                    location: {
                      center: aloneItem ?? [37.54770, 55.643393],
                      zoom: 15,
                    },
                    showScaleInCopyrights: true
                }"
                width="100%"
                height="382px"
            >
                <YandexMapDefaultSchemeLayer />
                <YandexMapDefaultFeaturesLayer />

                <YandexMapMarker
                    v-for="(marker, index) in modifyMarkers"
                    :key="index"
                    :settings="{
                        coordinates: marker.coords,
                    }"
                >
                    <MapMarker :class="`marker_${marker.id}`" />
                </YandexMapMarker>

                <YandexMapControls :settings="{ position: 'left' }">
                    <YandexMapZoomControl />
                </YandexMapControls>

                <YandexMapControls v-if="aloneItem" :settings="{ position: 'bottom right' }">
                    <YandexMapControlButton>
                        <a
                            :href="`https://maps.yandex.ru/?text=${aloneItem == null ? '55.755864+37.617698' : aloneItem[1] + '+' + aloneItem[0]}`"
                            target="_blank"
                        >
                            Открыть в Яндекс.Картах
                        </a>
                    </YandexMapControlButton>
                </YandexMapControls>

                <YandexMapFeature
                    :settings="{
                        id: 'featurePolygon',
                        geometry: {
                            type: 'Polygon',
                            coordinates: [polygonCoords],
                        },
                        style: {
                            fill: 'rgba(56, 56, 219, 0.5)',
                            stroke: [{ color: '#f00', width: 4 }],
                        }
                    }"
                />
            </YandexMap>

            <canvas
                v-if="props.isSelectSeveral"
                :style="drawButtonActive ? 'display: block' : 'display: none'"
                class="map__canvas"
                ref="mapCanvasRef"
            />
        </div>
    </div>
</template>

<script setup>
    import './Map.scss'

    import {
        YandexMap,
        YandexMapControlButton, YandexMapControls,
        YandexMapDefaultFeaturesLayer,
        YandexMapDefaultSchemeLayer, YandexMapFeature, YandexMapMarker, YandexMapZoomControl
    } from "vue-yandex-maps";

    import {computed, ref, shallowRef} from "vue";
    import MapTop from "@/components/AppInputs/Address/Map/MapTop/MapTop.vue";
    import MapMarker from "@/components/AppIcons/MapMarker/MapMarker.vue";

    const props = defineProps({
        markers: {
            default: [],
            type: Array
        },
        isSelectSeveral: {
            default: false,
            type: Boolean
        },
        isReadOnly: {
            default: false,
            type: Boolean
        }
    })

    const emit = defineEmits([
        'selectPoints'
    ])

    // Проверка на получение только одного маркера
    const aloneItem = computed(() => {
        return props.markers.length === 1 && !props.isSelectSeveral ? props.markers[0].label.coords : null;
    })

    const canvasOptions = {
        strokeStyle: '#0000ff',
        lineWidth: 4,
        opacity: 0.7
    };

    const map = shallowRef(null);
    const mapCanvasRef = ref(null);
    const modifyMarkers = computed(() => {
        return props.markers.map((marker, index) => {
            return {
                ...marker,
                id: index
            }
        })
    })

    const drawButtonActive = ref(false);

    const polygonCoords = ref([]);
    const drawMarkers = ref([]);
    const gettingCoords = ref([]);

    // Отрисовка маркеров по координатам карты
    const drawNestedMarkers = (bounds, context) => {
        // Функция для рисования круга (точки)
        const fillCircle = (context, x, y, radius) => {
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI);
            context.closePath()
        };

        // Очищаем массив с нарисованными маркерами
        drawMarkers.value = [];

        for (let marker of modifyMarkers.value) {
            // Получаем координаты в пикселях для отрисовки точки в canvas
            const markerElem = map.value.container.querySelector(`.marker_${marker.id}`).parentNode.parentNode.parentNode;
            const coords = markerElem.style.transform.replace(/[^0-9\s.]+/g, '').split(' ');

            // Убираем погрешность в позиционировании и присваиваем точки переменным
            const x = Math.round(+coords[0]);
            const y = Math.round(+coords[1] - 5);

            // Проверка на наличие точки в обалсти видимости пользователя
            if (bounds[0][0] < +marker.coords[0] && +marker.coords[0] < bounds[1][0] &&
                bounds[1][1] < +marker.coords[1] && +marker.coords[1] < bounds[0][1]) {

                // Отрисовка невидемой точки для будущей проверки
                fillCircle(context, x, y, 5);
                drawMarkers.value.push({
                    canvasCoords: [x, y],
                    ...marker
                });
            }
        }
    };

    // Инициализация рисования полигона
    const toggleDraw = (status) => {
        if (!status) {
            drawButtonActive.value = false;
            return;
        }

        drawButtonActive.value = true;
        const bounds = map.value.bounds;

        initDrawEventsCanvas(bounds)
            .then(function (coordinates) {
                // Переводим координаты из 0..1 в географические.
                coordinates = coordinates.map(function (x) {
                    return [
                        // Широта (latitude).
                        // Y переворачивается, т.к. на canvas'е он направлен вниз.
                        bounds[0][0] + x[0] * (bounds[1][0] - bounds[0][0]),
                        // Долгота (longitude).
                        bounds[0][1] + x[1] * (bounds[1][1] - bounds[0][1]),
                    ];
                });

                // Тут надо симплифицировать линию.
                coordinates = coordinates.filter(function (_, index) {
                    return index % 3 === 0;
                });

                // Удаляем старый полигон.
                if (polygonCoords.value.length > 0) polygonCoords.value = [];

                // Создаем на основе конвертированных
                polygonCoords.value = coordinates;

                drawButtonActive.value = false;

                // Отдаем полученные точки в функцию
                emit('selectPoints', JSON.parse(JSON.stringify(gettingCoords.value)));
            })

    }

    // Инициализация полигона и подписка canvas элемента на события мыши
    const initDrawEventsCanvas = (bounds) => {
        const canvas = mapCanvasRef.value;
        const ctx2d = canvas.getContext('2d');

        let drawing = false;
        let coordinates = [];

        // Задаем размеры канвасу как у карты.
        const rect = map.value.container.getBoundingClientRect();
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        canvas.width = rect.width;
        canvas.height = rect.height;

        // Применяем стили.
        ctx2d.strokeStyle = canvasOptions.strokeStyle;
        ctx2d.lineWidth = canvasOptions.lineWidth;
        canvas.style.opacity = canvasOptions.opacity;

        // Очищаем канвас
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);

        // При нажатии мыши запоминаем, что мы начали рисовать и записываем координаты.
        canvas.onmousedown = function (e) {
            drawing = true;

            coordinates.push([e.offsetX, e.offsetY]);
        };

        // При движении мыши запоминаем координаты и рисуем линию.
        canvas.onmousemove = function (e) {
            if (drawing) {
                ctx2d.lineTo(e.offsetX, e.offsetY);
                ctx2d.stroke();

                coordinates.push([e.offsetX, e.offsetY]);
            }
        };

        return new Promise(function (resolve) {
            // При отпускании мыши запоминаем координаты и скрываем канвас.
            canvas.onmouseup = function (e) {
                gettingCoords.value = [];

                // Очищаем канвас от нарисованной фигуры
                ctx2d.clearRect(0, 0, canvas.width, canvas.height);

                drawNestedMarkers(bounds, ctx2d);

                // Рисуем полноценную фигуру на основе полученных координат
                ctx2d.beginPath();
                coordinates.forEach((item) => {
                    ctx2d.lineTo(item[0], item[1])
                });

                // Проверяем находиться ли точка в выделенном секторе и добавляем ее в массив
                drawMarkers.value.forEach(marker => {
                    if (ctx2d.isPointInPath(marker.canvasCoords[0], marker.canvasCoords[1])) {
                        gettingCoords.value.push({
                            text: marker.text,
                            coords: marker.coords
                        })
                    }
                });

                // Добавляем конечную точку, на которой мы опустили мышь
                coordinates.push([e.offsetX, e.offsetY]);

                // Отменяем рисование фигуры
                drawing = false;

                coordinates = coordinates.map(function (x) {
                    return [x[0] / canvas.width, x[1] / canvas.height];
                });

                // Отдаем полученные координаты нарисованной фигуры
                resolve(coordinates);
            };
        });
    }
</script>