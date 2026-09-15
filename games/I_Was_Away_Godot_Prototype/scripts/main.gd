extends Node3D

# I WAS AWAY — compact Godot prototype
# Mouse drag = orbit camera
# Mouse wheel = zoom
# Space / THROW button = boomerang loop
# R / RESET button = reset camera

var orbit_yaw := deg_to_rad(18.0)
var orbit_pitch := deg_to_rad(-12.0)
var orbit_distance := 13.5
var orbit_target := Vector3(0.0, 1.25, -2.8)
var dragging := false
var auto_orbit := false
var placeholders_visible := true
var last_mouse := Vector2.ZERO

var player: Node3D
var instructor: Node3D
var boomerang: Node3D
var camera: Camera3D
var camera_rig: Node3D
var world_env: WorldEnvironment
var status_label: Label

var throwing := false
var throw_time := 0.0
var throw_duration := 2.65
var throw_start := Vector3.ZERO
var throw_c1 := Vector3.ZERO
var throw_c2 := Vector3.ZERO
var throw_end := Vector3.ZERO

var grass_blades: Array[MeshInstance3D] = []
var lake: MeshInstance3D

func _ready() -> void:
	_build_environment()
	_build_characters()
	_build_boomerang()
	_build_camera()
	_build_ui()
	_update_camera()

func _process(delta: float) -> void:
	if auto_orbit and not dragging:
		orbit_yaw += delta * 0.18
		_update_camera()
	_animate_environment(delta)
	_animate_boomerang(delta)

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseButton:
		var mouse_event: InputEventMouseButton = event as InputEventMouseButton
		if mouse_event.button_index == MOUSE_BUTTON_LEFT:
			dragging = mouse_event.pressed
			last_mouse = mouse_event.position
		elif mouse_event.button_index == MOUSE_BUTTON_WHEEL_UP and mouse_event.pressed:
			orbit_distance = clamp(orbit_distance - 0.8, 6.5, 24.0)
			_update_camera()
		elif mouse_event.button_index == MOUSE_BUTTON_WHEEL_DOWN and mouse_event.pressed:
			orbit_distance = clamp(orbit_distance + 0.8, 6.5, 24.0)
			_update_camera()
	elif event is InputEventMouseMotion and dragging:
		var mouse_motion: InputEventMouseMotion = event as InputEventMouseMotion
		var motion: Vector2 = mouse_motion.relative
		orbit_yaw -= motion.x * 0.006
		orbit_pitch = clamp(orbit_pitch - motion.y * 0.0045, deg_to_rad(-55.0), deg_to_rad(28.0))
		_update_camera()
	elif event is InputEventKey:
		var key_event: InputEventKey = event as InputEventKey
		if key_event.pressed and not key_event.echo:
			if key_event.keycode == KEY_SPACE:
				_throw_boomerang()
			elif key_event.keycode == KEY_R:
				_reset_camera()

func _build_environment() -> void:
	# Sky / atmosphere
	world_env = WorldEnvironment.new()
	var env := Environment.new()
	env.background_mode = Environment.BG_COLOR
	env.background_color = Color("7fa4bb")
	env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
	env.ambient_light_color = Color("c8d8df")
	env.ambient_light_energy = 0.72
	env.tonemap_mode = Environment.TONE_MAPPER_FILMIC
	env.fog_enabled = true
	env.fog_light_color = Color("b8c4c7")
	env.fog_light_energy = 0.35
	env.fog_density = 0.006
	env.fog_height = 2.0
	env.fog_height_density = 0.13
	world_env.environment = env
	add_child(world_env)

	var sun := DirectionalLight3D.new()
	sun.light_color = Color("ffe6bf")
	sun.light_energy = 2.0
	sun.rotation_degrees = Vector3(-48.0, -32.0, 0.0)
	sun.shadow_enabled = true
	add_child(sun)

	# Main terrain: rolling open ledge rather than a boxed arena.
	var terrain_mesh := _make_terrain_mesh(60, 60, 2.2)
	var terrain := MeshInstance3D.new()
	terrain.name = "Terrain"
	terrain.mesh = terrain_mesh
	var terrain_mat := StandardMaterial3D.new()
	terrain_mat.albedo_color = Color("718653")
	terrain_mat.roughness = 1.0
	terrain.material_override = terrain_mat
	terrain.cast_shadow = GeometryInstance3D.SHADOW_CASTING_SETTING_ON
	add_child(terrain)

	# Collision floor around playable overlook.
	var floor_body := StaticBody3D.new()
	var floor_shape := CollisionShape3D.new()
	var box := BoxShape3D.new()
	box.size = Vector3(24.0, 0.5, 22.0)
	floor_shape.shape = box
	floor_shape.position = Vector3(0.0, -0.35, -1.0)
	floor_body.add_child(floor_shape)
	add_child(floor_body)

	# Lake plane below the ledge.
	lake = MeshInstance3D.new()
	var lake_mesh := PlaneMesh.new()
	lake_mesh.size = Vector2(115.0, 85.0)
	lake.mesh = lake_mesh
	lake.position = Vector3(0.0, -6.4, -42.0)
	var water := StandardMaterial3D.new()
	water.albedo_color = Color(0.26, 0.48, 0.60, 0.86)
	water.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
	water.roughness = 0.18
	water.metallic = 0.05
	lake.material_override = water
	add_child(lake)

	# Distant mountain silhouettes to keep the horizon open.
	var rng := RandomNumberGenerator.new()
	rng.seed = 240819
	for i in range(34):
		var a := TAU * float(i) / 34.0
		var radius := rng.randf_range(68.0, 92.0)
		var mountain := MeshInstance3D.new()
		var cone := CylinderMesh.new()
		cone.top_radius = 0.0
		cone.bottom_radius = rng.randf_range(5.5, 12.0)
		cone.height = rng.randf_range(10.0, 25.0)
		cone.radial_segments = 5
		mountain.mesh = cone
		mountain.position = Vector3(cos(a) * radius, cone.height * 0.15 - 5.2, sin(a) * radius - 24.0)
		mountain.scale = Vector3(1.8, 1.0, 1.3)
		var mm := StandardMaterial3D.new()
		mm.albedo_color = Color(0.31 + rng.randf_range(-0.025,0.025), 0.38, 0.32)
		mm.roughness = 1.0
		mountain.material_override = mm
		add_child(mountain)

	# Sparse foreground blades: enough for parallax, not a carpet of game assets.
	for i in range(160):
		var blade := MeshInstance3D.new()
		var quad := QuadMesh.new()
		quad.size = Vector2(rng.randf_range(0.05, 0.13), rng.randf_range(0.45, 1.25))
		blade.mesh = quad
		blade.position = Vector3(rng.randf_range(-13.0, 13.0), rng.randf_range(0.2, 0.5), rng.randf_range(-11.0, 7.0))
		blade.rotation.y = rng.randf_range(0.0, TAU)
		var gm := StandardMaterial3D.new()
		gm.albedo_color = Color(0.23, rng.randf_range(0.38,0.56), 0.17, 0.88)
		gm.transparency = BaseMaterial3D.TRANSPARENCY_ALPHA
		gm.shading_mode = BaseMaterial3D.SHADING_MODE_UNSHADED
		gm.cull_mode = BaseMaterial3D.CULL_DISABLED
		blade.material_override = gm
		add_child(blade)
		grass_blades.append(blade)

func _make_terrain_mesh(x_count: int, z_count: int, spacing: float) -> ArrayMesh:
	var st := SurfaceTool.new()
	st.begin(Mesh.PRIMITIVE_TRIANGLES)
	var half_x := float(x_count - 1) * spacing * 0.5
	var half_z := float(z_count - 1) * spacing * 0.5
	for z in range(z_count - 1):
		for x in range(x_count - 1):
			var p00 := _terrain_point(x, z, spacing, half_x, half_z)
			var p10 := _terrain_point(x + 1, z, spacing, half_x, half_z)
			var p01 := _terrain_point(x, z + 1, spacing, half_x, half_z)
			var p11 := _terrain_point(x + 1, z + 1, spacing, half_x, half_z)
			st.set_uv(Vector2(float(x)/x_count, float(z)/z_count)); st.add_vertex(p00)
			st.set_uv(Vector2(float(x+1)/x_count, float(z)/z_count)); st.add_vertex(p10)
			st.set_uv(Vector2(float(x)/x_count, float(z+1)/z_count)); st.add_vertex(p01)
			st.set_uv(Vector2(float(x+1)/x_count, float(z)/z_count)); st.add_vertex(p10)
			st.set_uv(Vector2(float(x+1)/x_count, float(z+1)/z_count)); st.add_vertex(p11)
			st.set_uv(Vector2(float(x)/x_count, float(z+1)/z_count)); st.add_vertex(p01)
	st.generate_normals()
	return st.commit()

func _terrain_point(x: int, z: int, spacing: float, half_x: float, half_z: float) -> Vector3:
	var px := float(x) * spacing - half_x
	var pz := float(z) * spacing - half_z
	var y := sin(px * 0.095) * 0.35 + cos(pz * 0.085) * 0.28 + sin((px+pz)*0.04) * 0.48
	# broad downhill valley in front of the player
	if pz < -9.0:
		y -= min(8.0, abs(pz + 9.0) * 0.19)
	return Vector3(px, y, pz - 16.0)

func _build_characters() -> void:
	player = _make_placeholder("Player", Vector3(-1.3, 0.05, -3.6), Color("24363c"), Color("8b6249"))
	instructor = _make_placeholder("Instructor", Vector3(1.5, 0.05, -5.0), Color("646d73"), Color("a17456"))

func _make_placeholder(label: String, position_3d: Vector3, shirt_color: Color, skin_color: Color) -> Node3D:
	var root := Node3D.new()
	root.name = label
	root.position = position_3d
	add_child(root)

	var shirt_mat := StandardMaterial3D.new()
	shirt_mat.albedo_color = shirt_color
	shirt_mat.roughness = 0.88
	var skin_mat := StandardMaterial3D.new()
	skin_mat.albedo_color = skin_color
	skin_mat.roughness = 0.92
	var pants_mat := StandardMaterial3D.new()
	pants_mat.albedo_color = Color("3d4348")
	pants_mat.roughness = 0.95

	var torso := MeshInstance3D.new()
	var torso_mesh := CapsuleMesh.new()
	torso_mesh.radius = 0.29
	torso_mesh.height = 1.08
	torso.mesh = torso_mesh
	torso.position.y = 1.1
	torso.material_override = shirt_mat
	root.add_child(torso)

	var head := MeshInstance3D.new()
	var head_mesh := SphereMesh.new()
	head_mesh.radius = 0.20
	head_mesh.height = 0.40
	head.mesh = head_mesh
	head.position.y = 1.82
	head.material_override = skin_mat
	root.add_child(head)

	for side in [-1.0, 1.0]:
		var leg := MeshInstance3D.new()
		var leg_mesh := CapsuleMesh.new()
		leg_mesh.radius = 0.105
		leg_mesh.height = 0.76
		leg.mesh = leg_mesh
		leg.position = Vector3(side * 0.13, 0.43, 0.0)
		leg.material_override = pants_mat
		root.add_child(leg)

	return root

func _build_boomerang() -> void:
	boomerang = Node3D.new()
	boomerang.name = "Boomerang"
	add_child(boomerang)

	var wood := StandardMaterial3D.new()
	wood.albedo_color = Color("884b27")
	wood.roughness = 0.5

	for arm_data in [
		{"pos": Vector3(-0.22,0,0), "rot": deg_to_rad(32.0)},
		{"pos": Vector3(0.22,0,0), "rot": deg_to_rad(-32.0)}
	]:
		var arm := MeshInstance3D.new()
		var box := BoxMesh.new()
		box.size = Vector3(0.78, 0.08, 0.18)
		arm.mesh = box
		arm.position = arm_data.pos
		arm.rotation.y = arm_data.rot
		arm.material_override = wood
		boomerang.add_child(arm)

	boomerang.scale = Vector3.ONE * 0.82
	boomerang.position = player.position + Vector3(0.4, 1.25, 0.1)

func _build_camera() -> void:
	camera_rig = Node3D.new()
	camera_rig.name = "CameraRig"
	add_child(camera_rig)
	camera = Camera3D.new()
	camera.name = "OrbitCamera"
	camera.current = true
	camera.fov = 60.0
	camera.near = 0.08
	camera.far = 500.0
	camera_rig.add_child(camera)

func _update_camera() -> void:
	if camera == null:
		return
	var cp := cos(orbit_pitch)
	var offset := Vector3(
		sin(orbit_yaw) * cp,
		sin(orbit_pitch),
		cos(orbit_yaw) * cp
	) * orbit_distance
	camera.global_position = orbit_target + offset
	camera.look_at(orbit_target, Vector3.UP)

func _build_ui() -> void:
	var ui := CanvasLayer.new()
	add_child(ui)

	var panel := PanelContainer.new()
	panel.position = Vector2(18,18)
	panel.size = Vector2(520, 124)
	var style := StyleBoxFlat.new()
	style.bg_color = Color(0.025,0.04,0.065,0.78)
	style.border_color = Color(1,1,1,0.14)
	style.set_border_width_all(1)
	style.corner_radius_top_left = 14
	style.corner_radius_top_right = 14
	style.corner_radius_bottom_left = 14
	style.corner_radius_bottom_right = 14
	panel.add_theme_stylebox_override("panel", style)
	ui.add_child(panel)

	var copy := VBoxContainer.new()
	copy.add_theme_constant_override("separation", 5)
	panel.add_child(copy)
	var title := Label.new()
	title.text = "I WAS AWAY · GODOT OUTDOOR PROTOTYPE"
	title.add_theme_font_size_override("font_size", 18)
	copy.add_child(title)
	var sub := Label.new()
	sub.text = "Open landscape · orbit camera · two placeholders · working boomerang loop\nDrag to orbit · wheel to zoom · SPACE to throw · R to reset"
	sub.add_theme_font_size_override("font_size", 13)
	copy.add_child(sub)

	var buttons := HBoxContainer.new()
	buttons.position = Vector2(18, 650)
	buttons.size = Vector2(750, 48)
	buttons.add_theme_constant_override("separation", 8)
	ui.add_child(buttons)

	var throw_button := Button.new()
	throw_button.text = "THROW BOOMERANG"
	throw_button.pressed.connect(_throw_boomerang)
	buttons.add_child(throw_button)

	var orbit_button := Button.new()
	orbit_button.text = "AUTO ORBIT: OFF"
	orbit_button.pressed.connect(func():
		auto_orbit = not auto_orbit
		orbit_button.text = "AUTO ORBIT: " + ("ON" if auto_orbit else "OFF")
	)
	buttons.add_child(orbit_button)

	var people_button := Button.new()
	people_button.text = "PLACEHOLDERS: ON"
	people_button.pressed.connect(func():
		placeholders_visible = not placeholders_visible
		player.visible = placeholders_visible
		instructor.visible = placeholders_visible
		people_button.text = "PLACEHOLDERS: " + ("ON" if placeholders_visible else "OFF")
	)
	buttons.add_child(people_button)

	var reset_button := Button.new()
	reset_button.text = "RESET CAMERA"
	reset_button.pressed.connect(_reset_camera)
	buttons.add_child(reset_button)

	status_label = Label.new()
	status_label.position = Vector2(18, 615)
	status_label.text = "READY"
	status_label.add_theme_font_size_override("font_size", 13)
	ui.add_child(status_label)

func _throw_boomerang() -> void:
	if throwing:
		return
	throwing = true
	throw_time = 0.0
	throw_start = player.global_position + Vector3(0.45, 1.28, 0.05)
	var outward := (orbit_target - camera.global_position)
	outward.y = 0.0
	outward = outward.normalized()
	var right := outward.cross(Vector3.UP).normalized()
	throw_c1 = throw_start + outward * 7.0 + right * 4.8 + Vector3.UP * 2.3
	throw_c2 = throw_start + outward * 10.5 - right * 4.5 + Vector3.UP * 3.0
	throw_end = throw_start
	status_label.text = "BOOMERANG IN FLIGHT"

func _animate_boomerang(delta: float) -> void:
	if not throwing:
		boomerang.global_position = boomerang.global_position.lerp(player.global_position + Vector3(0.45,1.28,0.05), 0.12)
		return
	throw_time += delta
	var t := clamp(throw_time / throw_duration, 0.0, 1.0)
	boomerang.global_position = _cubic_bezier(t, throw_start, throw_c1, throw_c2, throw_end)
	boomerang.rotate_y(delta * 18.0)
	boomerang.rotate_z(delta * 11.0)
	if t >= 1.0:
		throwing = false
		status_label.text = "CAUGHT — READY"

func _cubic_bezier(t: float, a: Vector3, b: Vector3, c: Vector3, d: Vector3) -> Vector3:
	var u := 1.0 - t
	return a * (u*u*u) + b * (3.0*u*u*t) + c * (3.0*u*t*t) + d * (t*t*t)

func _reset_camera() -> void:
	orbit_yaw = deg_to_rad(18.0)
	orbit_pitch = deg_to_rad(-12.0)
	orbit_distance = 13.5
	_update_camera()

func _animate_environment(delta: float) -> void:
	var now := Time.get_ticks_msec() / 1000.0
	for i in range(grass_blades.size()):
		var blade := grass_blades[i]
		blade.rotation.z = sin(now * 1.1 + i * 0.37) * 0.055
	if lake != null:
		lake.position.y = -6.4 + sin(now * 0.42) * 0.018
