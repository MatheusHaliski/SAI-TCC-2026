package com.sai.backend.entity.enums;

public enum Visibility {
    private_v, public_v;

    public static Visibility from(String val) {
        return val != null && val.equals("public") ? public_v : private_v;
    }

    public String toJson() {
        return this == public_v ? "public" : "private";
    }
}
