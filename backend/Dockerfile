# ==========================================
# Stage 1: Build ứng dụng bằng Maven & JDK 17
# ==========================================
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

# Tối ưu cache: Tải dependencies trước để không phải tải lại mỗi khi code thay đổi
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy mã nguồn và đóng gói JAR (bỏ qua chạy unit test lúc build)
COPY src ./src
RUN mvn clean package -DskipTests -B

# ==========================================
# Stage 2: Runtime môi trường siêu nhẹ (JRE 17 Alpine)
# ==========================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Cổng mặc định của Spring Boot
EXPOSE 8080

# Copy file .jar đã đóng gói từ Stage 1
COPY --from=build /app/target/*.jar app.jar

# Tối ưu RAM cho gói Free của Render (512MB RAM):
# - Giới hạn RAM JVM ở mức 75% container (~380MB) để tránh bị Render OOM kill (Exit 137)
# - Thiết lập mã hóa UTF-8
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Dfile.encoding=UTF-8"

# Khởi chạy ứng dụng
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
